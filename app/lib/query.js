import { MongoClient } from 'mongodb'
import { fetchLinkedInProfile } from './grablinkedin'
import { unstable_noStore as noStore } from 'next/cache';


function convertUnixToEST(unixTime) {
    // Create a new Date object using the Unix timestamp
    let date = new Date(unixTime * 1000);

    // Convert to EST by using 'America/New_York' time zone
    let options = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };

    // Format the date using Intl.DateTimeFormat
    let formatter = new Intl.DateTimeFormat('en-US', options);
    let parts = formatter.formatToParts(date);

    // Extract parts and format the string
    let month = parts.find(part => part.type === 'month').value;
    let day = parts.find(part => part.type === 'day').value;
    let year = parts.find(part => part.type === 'year').value;
    let hour = parts.find(part => part.type === 'hour').value;
    let minute = parts.find(part => part.type === 'minute').value;
    let dayPeriod = parts.find(part => part.type === 'dayPeriod').value;

    // Return formatted string
    return `${month}/${day}/${year} @ ${hour}:${minute} ${dayPeriod} EST`;
}

async function grabEmailSequence(emailSequences, userId, emailSequence) {
    //grab sequence for number
    const emailSequenceQuery = {
        userId: userId,
        sequenceName: emailSequence
    }
    const emailSequenceRet = await emailSequences.findOne(emailSequenceQuery);
    return emailSequenceRet;
}

async function grabOrCacheLinkedinData(linkedinCollection, badLinkedinCollection, linkedinUrl, jobName, userId, email, sequenceName) {
    const linkedinQuery = {
        linkedinUrl: linkedinUrl
    }
    const badlinkedinQuery = {
        linkedinUrl: linkedinUrl,
        jobName: jobName,
        userId: userId,
        email: email,
        sequenceName: sequenceName
    }
    //using cache or populating it
    var foundLinkedinData = await linkedinCollection.findOne(linkedinQuery)
    var foundBadLinkedin = await badLinkedinCollection.findOne(badlinkedinQuery)
    if (foundBadLinkedin !== null) {
        console.log("this is BAD linkedin")
        throw errow;
    }
    if (foundLinkedinData === null) {
        console.log("did not hit cache!!!!")
        try {
            foundLinkedinData = await fetchLinkedInProfile(linkedinUrl)
            console.log("cacheing the linkedin data!")
            await linkedinCollection.insertOne({
                linkedinUrl: linkedinUrl,
                data: foundLinkedinData
            });
        } catch (error) {
            console.log("linkedin has an error, CACHEING!")
            //we use badLinkedin collection to calculate job status
            await badLinkedinCollection.insertOne({
                linkedinUrl: linkedinUrl,
                email: email,
                jobName: jobName,
                userId: userId,
                sequenceName: sequenceName
            })
        }
    } else {
        console.log("hit cache!")
        foundLinkedinData = foundLinkedinData.data
    }
    return foundLinkedinData
}

/*
    Default name for sequenceName -> this for the transition with Pearce
*/

async function returnDataForProspect(email, linkedinUrl, jobName, userId, sequenceName) {

    if (sequenceName === undefined) {
        sequenceName = "inbound leads tally@1716907164331" //just for Pearce transition
    }

    const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 65000, //increased timeout for shakey network conditions
    });

    var returnedObject = {
        personName: "",
        company: "",
        sequence: "",
        stage: "0/0",
        lastContacted: "",
        linkedin: linkedinUrl
    }

    try {
        await client.connect();
        const database = await client.db('users');
        const emailCollection = await database.collection('emailsQueue');
        const emailSequences = await database.collection('emailSequences')
        const linkedinCollection = await database.collection('linkedin')
        const badLinkedinCollection = await database.collection('badLinkedin')
        const query = {
            userId: userId,
            jobName: jobName,
            email: email,
            linkedin: linkedinUrl
        }
        const foundEmail = await emailCollection.findOne(query)
        //case - when the email is post linkedin request but not finished
        if (foundEmail !== null && foundEmail.sequenceId !== undefined && foundEmail.linkedinData !== undefined) {
            //means it has the linkedin data
            returnedObject.personName = foundEmail.linkedinData.name
            returnedObject.company = foundEmail.linkedinData.currentCompanyDescription.name
            returnedObject.sequence = sequenceName
            returnedObject.lastContacted = convertUnixToEST(foundEmail.lastSentTime)
            //grab sequence for number
            const emailSequence = await grabEmailSequence(emailSequences, userId, sequenceName);
            if (emailSequence !== null) {
                returnedObject.stage = `${foundEmail.sequenceId} / ${emailSequence.steps.length}`
            }
        } else if (foundEmail !== null) {
            //case - its in the first sequence, so no Linkedin data; need to grab it
            /*
                GOAL -> this should really never execute!
                {
                    linkedinUrl: 
                    data:
                }
            */
            const emailSequence = await grabEmailSequence(emailSequences, userId, sequenceName); //not working for current stuff -> can just switch to default!
            const linkedinQuery = {
                linkedUrl: foundEmail.linkedin
            }
            //using cache or populating it
            try {
                //(linkedinCollection, linkedinUrl, jobName, userId, email, sequenceName)
                const foundLinkedinData = await grabOrCacheLinkedinData(linkedinCollection, badLinkedinCollection, foundEmail.linkedin, foundEmail.jobName, foundEmail.userId, foundEmail.email, foundEmail.sequenceName)
                returnedObject.personName = foundLinkedinData.name
                returnedObject.company = foundLinkedinData.currentCompanyDescription.name
                returnedObject.sequence = sequenceName
                returnedObject.stage = `0 / ${emailSequence.steps.length}`
                returnedObject.lastContacted = "Not yet"
            } catch (error) {
                returnedObject.personName = linkedinUrl
                returnedObject.company = "Bad Data"
                returnedObject.sequence = "Bad Data"
                returnedObject.stage = "Bad Data"
                returnedObject.lastContacted = "Bad Data"
            }
        } else {
            //the email does not exit, in this case it needs to be created -> the sequenceName (this should be uploaded with the job name i think now?)
            /*
                From now on -> this should always hit the cacheing layer!
            */
            try {               //email, linkedinUrl, jobName, userId, sequenceName)
                console.log("here!")
                const foundLinkedinData = await grabOrCacheLinkedinData(linkedinCollection, badLinkedinCollection, linkedinUrl, jobName, userId, email, sequenceName)
                returnedObject.personName = foundLinkedinData.name
                returnedObject.company = foundLinkedinData.currentCompanyDescription.name
                returnedObject.sequence = sequenceName
                returnedObject.stage = "finished"
                returnedObject.lastContacted = "finished"
            } catch (error) {
                returnedObject.personName = "Bad Data"
                returnedObject.company = "Bad Data"
                returnedObject.sequence = "Bad Data"
                returnedObject.stage = "Bad Data"
                returnedObject.lastContacted = "Bad Data"
            }
        }
        await client.close()
        return returnedObject
    } catch (error) {
        console.log(error);
        returnedObject.personName = "Bad-Data"
        returnedObject.company = "Bad-Data"
        returnedObject.sequence = "Bad-Data"
        returnedObject.stage = "Bad-Data"
        returnedObject.lastContacted = "Bad-Data"
        return returnedObject
    }
}


//default value for Pearce testing
//const metadata = await returnDataForProspect("ankitbansal@microsoft.com", "http://www.linkedin.com/in/ankit2901", "Named Account List Prod Sec USA 200@1714086200863", "user_2eW06TynA0oUhck1yfznEh6wFkz", undefined);
//console.log(metadata)

/*
    what you want
    1. Person Name
    2. Company 

    //can be looked up in the emailQueue collection
    3. Sequence Stage -> can be determined from the collection
    4. Last Contacted -> 
            if does not exist -> finished 
            if does exist
                    Sequence Stage 

                    -> 0 -> not contacted yet 
                    -> X -> contacted at lastSentTime
*/

/*
    TDD -> What kind of cases it will need handle? 

    - Pearce with his non transitioned ass
    - Everyone else who is transitioned


    3 cases per section 
        1. Case where the email doesn't exist -> meaning it has to create everything and cache it -> IE it finished processing it!
        2. Case where it hasn't sent the first email -> so you have to cache the Linkedin and copy/paste it
        3. Case where it has sent the first email, but not finished -> easiest case because all you have to do is just parse
*/

// Case 1a. 
//const metadata = await returnDataForProspect("hassansyed1029@gmail.com", "https://www.linkedin.com/in/hassan-s-215726187/", "Named Account List Prod Sec USA 200@1714086200863", "user_2eW06TynA0oUhck1yfznEh6wFkz", undefined);
//console.log(metadata)

// Case 1b. 
//const metadata = await returnDataForProspect("hassansyed1029@gmail.com", "https://www.linkedin.com/in/hassan-s-215726187/", "Named Account List Prod Sec USA 200@1714086200863", "user_2exb4kICgWwUqF5A5Ghh7gZtUpU", "we selling shit shit shit shit@1716776034567");
//console.log(metadata)

// Case 2a. -> invalid linkedin url provided
//const metadata = await returnDataForProspect("andrew.flannery@microsoft.com", "http://www.linkedin.com/sales/lead/ACwAAANkX7oB2AUtRjtVne4oDCmWPXQYzS7hxUE,NAME_SEARCH,MrO-", "Named Account List Prod Sec USA 200@1714086200863", "user_2eW06TynA0oUhck1yfznEh6wFkz", undefined);
//console.log(metadata)

// Case 2b/c -> just stuck on step 0 for whatever reason
//const metadata = await returnDataForProspect("ugochukwu.enyioha@jpmchase.com", "http://www.linkedin.com/in/ugoenyioha", "Prod Sec Named Account List remainder@1714086265149", "user_2eW06TynA0oUhck1yfznEh6wFkz", undefined);
//console.log(metadata)

// Case 3a. 
//const metadata = await returnDataForProspect("aerskine@doximity.com", "http://www.linkedin.com/in/amelia-erskine-7b1402129", "Named Account List Prod Sec USA 200@1714086200863", "user_2eW06TynA0oUhck1yfznEh6wFkz", undefined);
//console.log(metadata)


function printUnixTime() {
    // Get the current time in milliseconds since January 1, 1970
    const now = Date.now();

    // Convert milliseconds to seconds
    const unixTime = Math.floor(now / 1000);

    // Print the Unix time
    console.log(unixTime);
}


/*
    Need a function to query for a jobName and use that as the core to grab all the data!

    **WE NEED HI AMOUNT OF PARALLELIZATION FOR THIS TO WORK WELL***
*/
export default async function grabDataFromJobName(jobTitle, userId) {
    noStore();
    printUnixTime()
    const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 65000, //increased timeout for shakey network conditions
    });

    try {
        await client.connect();
        const database = await client.db('users');
        const userCollection = await database.collection('userData');

        //grab the correct job data
        const userGrabbed = await userCollection.findOne({ userId: userId })
        const targetJobObject = userGrabbed.jobs.filter(trav => {
            if (trav.jobTitle === jobTitle) {
                return true;
            }
        })
        const targetArray = targetJobObject[0].jobDataArray

        var requests = []
        for (let i = 0; i < targetArray.length && i < 45; i++) {
            const email = targetArray[i].email;
            const linkedin = targetArray[i].linkedin;
            //var temp = await returnDataForProspect(email, linkedin, jobTitle, userId, targetJobObject.sequenceName)
            //console.log(temp)
            requests.push(returnDataForProspect(email, linkedin, jobTitle, userId, targetJobObject.sequenceName))
        }
        const values = await Promise.all(requests)
        //console.log(values)
        printUnixTime()
        client.close()
        noStore();
        return values
    } catch (error) {
        //console.log(error)
        return values
    }
}

//await grabDataFromJobName("cache layer gang@1717104725565", "user_2exb4kICgWwUqF5A5Ghh7gZtUpU")

/*
    Adding a cacheing layer for linkedin!
*/ 