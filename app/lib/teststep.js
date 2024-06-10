"use server";

import { fetchLinkedInProfile } from '@/app/lib/grablinkedin.js'
import OpenAI from "openai";
import { MongoClient } from 'mongodb'

//functions that repopulate the new email with LinkedIn data
function replaceAllOccurrences(text, target, replacement) {
    if (!target) {
        // If target is empty, return the original text to avoid infinite loops
        return text;
    }
    return text.split(target).join(replacement);
}

function printUnixTime() {
    // Get the current time in milliseconds since January 1, 1970
    const now = Date.now();

    // Convert milliseconds to seconds
    const unixTime = Math.floor(now / 1000);

    // Print the Unix time
    return unixTime;
}

async function grabLinkedinDataAndGenerateEmail(linkedinUrl, subject_line_template, body_template) {
    //grab data from linked
    const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 65000, //increased timeout for shakey network conditions
    });
    await client.connect();
    const database = await client.db('users');
    const linkedinCollection = await database.collection('linkedin')
    const badLinkedinCollection = await database.collection('badLinkedin')
    var lData = '' //the data to be billed
    const query = {
        linkedinUrl: linkedinUrl
    }
    if ((await badLinkedinCollection.findOne(query)) != null) {
        console.log('bad cache hit!')
        await client.close()
        throw Error("bad linkedin, was discovered with bad cache!"); //bad linkedin
    }
    lData = await linkedinCollection.findOne(query);
    if (lData != null) {
        console.log('hit cache!')
        lData = lData.data
    } else {
        console.log('cache miss - grabbing from Nubela then saving!')
        try {
            lData = await fetchLinkedInProfile(linkedinUrl)
            await linkedinCollection.insertOne({
                linkedinUrl: linkedinUrl,
                creationTime: printUnixTime(),
                data: lData
            })
        } catch (error) {
            console.log('Nubela said it was a bad linkedin, caching and exiting!')
            await badLinkedinCollection.insertOne({
                linkedinUrl: linkedinUrl,
            })
            await client.close()
            throw error;
        }
    }
    var linkedinData = {
        firstName: (lData.name.split(" "))[0],
        lastName: (lData.name.split(" "))[1],
        companyName: lData.currentCompanyDescription.name,
        fullName: lData.name
    }
    //populating subject line template
    subject_line_template = replaceAllOccurrences(subject_line_template, "{{first_name}}", linkedinData.firstName)
    subject_line_template = replaceAllOccurrences(subject_line_template, "{{last_name}}", linkedinData.lastName)
    subject_line_template = replaceAllOccurrences(subject_line_template, "{{full_name}}", linkedinData.fullName)
    subject_line_template = replaceAllOccurrences(subject_line_template, "{{company_name}}", linkedinData.companyName)
    //populating body template
    body_template = replaceAllOccurrences(body_template, "{{first_name}}", linkedinData.firstName)
    body_template = replaceAllOccurrences(body_template, "{{last_name}}", linkedinData.lastName)
    body_template = replaceAllOccurrences(body_template, "{{full_name}}", linkedinData.fullName)
    body_template = replaceAllOccurrences(body_template, "{{company_name}}", linkedinData.companyName)
    return {
        subject_line: subject_line_template,
        body: body_template,
        linkedinData: lData
    };
}

//functions that repopulates all the examples
function replacePlaceholdersSequentially(text, replacements) {
    const placeholders = ['{{first_name}}', '{{last_name}}', '{{full_name}}', '{{company_name}}'];

    // Create a regular expression that matches any of the placeholders
    const regex = new RegExp(placeholders.join('|'), 'gi');

    let currentIndex = 0;
    // Replace each occurrence of any placeholder with the corresponding replacement from the array
    return text.replace(regex, () => {
        if (currentIndex < replacements.length) {
            return replacements[currentIndex++];
        }
        // If there are no more replacements left, just return the original placeholder
        return arguments[0];
    });
}

function filterKeysByPrefix(object, prefix) {
    const filteredEntries = Object.entries(object).filter(([key, value]) => key.startsWith(prefix));
    return filteredEntries.map(([key, value]) => value);
}

function repopulateAllExamples(examples_obj) {
    return {
        subject_line_one: replacePlaceholdersSequentially(examples_obj.step_subject_line, filterKeysByPrefix(examples_obj.step_example_subject_lines, '0')),
        body_one: replacePlaceholdersSequentially(examples_obj.step_template, filterKeysByPrefix(examples_obj.step_example_bodys, '0')),
        subject_line_two: replacePlaceholdersSequentially(examples_obj.step_subject_line, filterKeysByPrefix(examples_obj.step_example_subject_lines, '1')),
        body_two: replacePlaceholdersSequentially(examples_obj.step_template, filterKeysByPrefix(examples_obj.step_example_bodys, '1')),
    }
}

function removeOuterQuotes(str) {
    if(str === null || str === undefined || str.length === 0) {
        return str;
    }
    if(str.charAt(0) === "\"" && str.charAt(str.length-1) === "\"") {
        return str.slice(1,-1)
    } else {
        return str;
    }
}

async function generateEmail(linkedinUrl, stepData) {
    const parsedLinked = await grabLinkedinDataAndGenerateEmail(linkedinUrl, stepData.step_subject_line, stepData.step_template)
    if (stepData.step_example_subject_lines === null && stepData.step_example_bodys === null) {
        parsedLinked.body = removeOuterQuotes(parsedLinked.body.replace(/\\n/g, '\n')); //causing issues where newlines aren't being delimited well!
        return parsedLinked
    }

    //this should only be ran if there are examples to be re-populated
    const examplesPopulated = repopulateAllExamples(stepData)
    console.log(parsedLinked)
    var tt = generatePrompt(stepData.goal, parsedLinked.linkedinData, examplesPopulated.subject_line_one + "\n" + examplesPopulated.body_one, examplesPopulated.subject_line_two + "\n" + examplesPopulated.body_two, parsedLinked.subject_line, parsedLinked.body)
    return tt;
}

//generate prompt for openai
function generatePrompt(sellingDescription, linkedinData, exampleEmailOne, exampleEmailTwo, subjectTemplate, bodyTemplate) {
    return (
        `
        Given personal data about a person, please fill in the @ai_reference tag with a reference from the person's Linkedin. 
        
        This reference should refer to something specific about their Linkedin, past roles, their summary etc. 
        Do not give a generic reference.
        Use specific details like their past roles, names of companies etc.

        Their Linkedin: 

        ${JSON.stringify(linkedinData)}

        This is a sales email and the goal is too: 

        ${sellingDescription}

        Given the recipent's LinkedIn data, please fill in the @ai_reference parts with what you think should be there.

        Subject Template: 

        ${subjectTemplate}

        Body Template: 

        ${bodyTemplate}

        The reference should sound casual and very human, don't use cliches.

        This should be a conversational tone, and use US english.

        When it comes to writing content, two factors are crucial, “perplexity” and “burstiness.” Perplexity measures the complexity of text. Separately, burstiness compares the variations of sentences. 
        Humans tend to write with greater burstiness, for example, with some longer or complex sentences alongside shorter ones. AI sentences tend to be more uniform. 
        Therefore, when writing the reference I need it to have a good amount of perplexity and burstiness.

        Make it as human-like as possible.

        The reference should be at or lower than a 3th grade reading and vocab level.

        Make sure the reference is not superflous.

        Here are a great examples: 

            ${exampleEmailOne}

            ${exampleEmailTwo}

        Further instructions:

        Please return ONLY the text of the created email in a json object, the subject line will be under the field named "subjectLine" and body will be under the field "body". 
        Return that JSON object and nothing more, and make sure it's formatted correctly.

        Remember these two things with JSON: 

        Multiline String: JSON does not support multiline strings directly. The "body" field in your JSON includes a multiline string, which breaks the format.

        Quote Handling: JSON requires double quotes for strings, and these must be escaped within strings. The double quotes around "YouTube's Paid Partner Program" and "Tally.ai" need to be escaped.

        Put extra spaces before the email signature and after the introduction!

        JSON requires all newlines within strings to be escaped with a backslash (\n) and it NEEDS TO BE A SINGLE LINE!

        MAKE SURE TO REMOVE ALL @ai_reference

        You HAVE to come up with a subjectLine and body that is a non empty string!

        If there is an email signature included DO NOT CHANGE IT OR EVEN CHANGE THE FORMATTING!
    `
    )
}

//to generate the test email
export async function testEmail(linkedinUrl, stepData) {
    console.log("Step data: ")
    console.log(stepData)
    /*
    if(stepData.step_example_subject_lines === null && stepData.step_example_bodys === null) {
        const emailNoAI = await generateEmail(linkedinUrl, stepData);
        return {
            message: JSON.parse(res.choices[0].message.content), 
            error: false
        }
    }
    */
    try {
        const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
        const plz = await generateEmail(linkedinUrl, stepData);
        console.log(plz)

        //user is not utilizing AI
        if (stepData.step_example_subject_lines === null && stepData.step_example_bodys === null) {
            return {
                message: {
                    subjectLine: plz.subject_line,
                    body: plz.body
                }
            }
        }

        const res = await openai.chat.completions.create({
            messages: [{ role: "system", content: plz }],
            top_p: 0.7,
            temperature: 0.7,
            model: "gpt-4",
            n: 1,
        });
        console.log(res.choices[0].message.content)
        return {
            message: JSON.parse(res.choices[0].message.content),
            error: false
        }
    } catch (error) {
        console.log(error)
        return {
            error: true
        }
    }
}
