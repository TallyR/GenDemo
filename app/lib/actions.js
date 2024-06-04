'use server';

import { UnipileClient } from 'unipile-node-sdk';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { MongoClient } from 'mongodb'
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { google } from 'googleapis';

export async function generateAndSaveGmailCredentials(accessToken) {
    //THIS CANNOT BE PUSHED TO GIT, NEEDS TO BE IN a .ENV enviornment
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://tallyai.app/linkaccount"
    );

    const info = await oauth2Client.getToken(accessToken)
    console.log("Refresh token:")
    console.log(info.tokens.refresh_token)

    //grab the gmail aliases
    const userGmailAuth = { "type": "authorized_user", "client_id": process.env.GOOGLE_CLIENT_ID, "client_secret": process.env.GOOGLE_CLIENT_SECRET, "refresh_token": info.tokens.refresh_token }
    const userGmail = await google.auth.fromJSON(userGmailAuth);
    const gmail = google.gmail({ version: 'v1', auth: userGmail });
    const aliasesResponse = await gmail.users.settings.sendAs.list({
        userId: 'me',
    });
    const aliases = aliasesResponse.data.sendAs;
    const profileResponse = await gmail.users.getProfile({
        userId: 'me',
    });
    console.log('Aliases: ');
    console.log(aliases)

    const { userId } = auth();
    const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    try {
        await client.connect();
        const database = await client.db('users');
        const userCollection = await database.collection('userData');
        const query = { userId: userId };
        var foundUser = await userCollection.findOne(query);
        if (foundUser === null) {
            const newUserDoc = {
                userId: userId,
                jobs: [],
                gmailAccessToken: info.tokens.access_token,
                gmailRefreshToken: info.tokens.refresh_token,
                gmailAlias: aliases[0].sendAsEmail
            }
            foundUser = await userCollection.insertOne(newUserDoc);
            console.log(`a new user document was inserted with the _id: ${foundUser.insertedId}`);
        } else {
            //update the user with the new unipile add
            const updateDoc = {
                $set: {
                    gmailAccessToken: info.tokens.access_token,
                    gmailRefreshToken: info.tokens.refresh_token,
                    gmailAlias: aliases[0].sendAsEmail
                },
            }
            const updatedUser = await userCollection.updateOne(query, updateDoc);
            console.log('Already found user, update a success!')
        }

    } catch (error) {
        console.log("Could not save user's gmail tokens");
        console.log(error);
    }

    redirect('/linkaccount')
}

export async function generateGmailAuthRedirect() {
    //THIS CANNOT BE PUSHED INTO GIHUB
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://tallyai.app/linkaccount"
    );
    const SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.readonly']
    const url = await oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    redirect(url)
}

export async function grabUserJobs() {
    noStore();
    const { userId } = auth();
    const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 65000, //increased timeout for shakey network conditions
    });
    try {
        await client.connect();
        const database = await client.db('users');
        const userCollection = await database.collection('userData');
        const jobsCollection = await database.collection(process.env.JOB_QUEUE_COLLECTION);
        const query = { userId: userId };
        const processingJobSet = new Set();
        var foundUser = await userCollection.findOne(query);
        var allJobs = await jobsCollection.find(query)
        allJobs = (await allJobs.toArray());
        for(var job of allJobs) {
            processingJobSet.add(job.jobName)
        }
        if (foundUser === null) {
            return []; // no jobs or user created yet
        }   
        /*
            Disable the jobs that have still not been ingested by the workers
        */
        console.log(processingJobSet)
        var cc = foundUser.jobs.map(e => {
            return {
                ...e, 
                stillProcessing: processingJobSet.has(e.jobTitle)
            }
        })
        console.log("HERE!")
        console.log(cc)
        return cc;
    } catch (error) {
        console.log(error);
    }
}

export async function testWrite(jobData) {
    noStore();
    const { userId } = auth();

    const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const database = await client.db('users');
        const userCollection = await database.collection('userData');
        const jobCollection = await database.collection(process.env.JOB_QUEUE_COLLECTION);
        const query = { userId: userId };
        var foundUserOrNeedToCreateOne = await userCollection.findOne(query);

        //check if user exist, does not create one
        if (foundUserOrNeedToCreateOne === null) {
            //need to add an entry in the database
            const newUserDoc = {
                userId: userId,
                jobs: []
            }
            foundUserOrNeedToCreateOne = await userCollection.insertOne(newUserDoc);
            console.log(`a new user document was inserted with the _id: ${foundUserOrNeedToCreateOne.insertedId}`);
            foundUserOrNeedToCreateOne = await userCollection.findOne(query);
        } else {
            console.log("FOUND USER IN DATABASE!");
        }

        //update the jobs array with new array data
        var newJobsArray = foundUserOrNeedToCreateOne.jobs;
        newJobsArray.push(jobData)
        const updateDoc = {
            $set: {
                jobs: newJobsArray
            },
        }
        const updatedUser = await userCollection.updateOne(query, updateDoc);

        //place it on jobs queue collection to be processed by server
        const jobQueueEntry = {
            jobData: jobData.jobDataArray,
            jobName: jobData.jobTitle,
            userId: foundUserOrNeedToCreateOne.userId,
            sequenceName: jobData.sequenceName
        }
        await jobCollection.insertOne(jobQueueEntry)

        //close connection
        await client.close();
    } catch (error) {
        console.log(error)
    }

    // redirect to prospecting page
    redirect('/')
}

export async function getNewHostedAuthLink() {
    noStore();
    const client = new UnipileClient(process.env.UNI_URI, process.env.UNI_API_KEY)
    const { userId } = auth();
    const response = await client.account.createHostedAuthLink({
        type: "create",
        api_url: process.env.UNI_URI,
        expiresOn: "2024-12-22T12:00:00.701Z",
        providers: ["GOOGLE"],
        success_redirect_url: "https://tallyai.app/linkaccount",
        notify_url: "https://tallyai.app/api/",
        name: userId
    })

    redirect(response.url)
}

/*
    Temporary methods to make sure aliases are usable!
*/
export async function disconnectGmail() {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await mongodbClient.connect();
        const database = await mongodbClient.db('users');
        const userCollection = await database.collection('userData');
        const query = { userId: userId };
        var foundUser = await userCollection.findOne(query);

        //create auth client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://tallyai.app/linkaccount"
        );

        //revoke auth token
        oauth2Client.setCredentials({
            //access_token: foundUser.gmailAccessToken,
            refresh_token: foundUser.gmailRefreshToken,
        });
        //refreshed accessToken + revoke
        await oauth2Client.refreshAccessToken();
        await oauth2Client.revokeCredentials();


        //now remove from user's profile
        var updatedUser = await userCollection.updateOne(query, {
            $set: {
                gmailAccessToken: 'NULL',
                gmailRefreshToken: 'NULL',
                gmailAlias: 'NULL'
            }
        });
        await mongodbClient.close(); //close connection

    } catch (error) {
        await mongodbClient.close();
        console.log("failed to revoke access!")
        console.log(error);
    }

    revalidatePath('/linkaccount')
}

export async function disconnectEmail() {
    noStore();

    const unipileClient = new UnipileClient(process.env.UNI_URI, process.env.UNI_API_KEY)
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {

        await mongodbClient.connect();
        const database = await mongodbClient.db('users');
        const userCollection = await database.collection('userData');
        const query = { userId: userId };
        var foundUser = await userCollection.findOne(query);
        var updatedUser = await userCollection.updateOne(query, {
            $set: {
                unipileAccountId: 'NULL'
            }
        });
        await mongodbClient.close(); //close connection
        const response = await unipileClient.account.delete(foundUser.unipileAccountId)
        console.log(response)

    } catch (error) {
        console.log(error)
    }

    revalidatePath('/linkaccount') //reset the page
}

/*
    Temporary methods to make sure aliases are usable!
*/
export async function checkIfGmailIsConnected() {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await mongodbClient.connect();
        const database = await mongodbClient.db('users');
        const userCollection = await database.collection('userData');
        const query = { userId: userId };
        var foundUser = await userCollection.findOne(query);
        await mongodbClient.close(); //close connection

        // check if user doesn't exist, or no unipile account connected
        console.log('checking account id')
        if (foundUser === null || !foundUser.gmailRefreshToken || foundUser.gmailRefreshToken === 'NULL') {
            console.log("User not found")
            return ({
                connected: false,
                emailAccount: "does_not_matter"
            })
        } else {
            console.log("FOUND USER IN DATABASE!");
        }

        //grab aliases (if present)
        const userGmailAuth = { "type": "authorized_user", "client_id": process.env.GOOGLE_CLIENT_ID, "client_secret": process.env.GOOGLE_CLIENT_SECRET, "refresh_token": foundUser.gmailRefreshToken }
        const userGmail = await google.auth.fromJSON(userGmailAuth);
        const gmail = google.gmail({ version: 'v1', auth: userGmail });
        const aliasesResponse = await gmail.users.settings.sendAs.list({
            userId: 'me',
        });
        const processedAliases = aliasesResponse.data.sendAs.map((trav) => {
            return {
                emailAlias: trav.sendAsEmail
            }
        })

        // grab active alias address and return
        return ({
            connected: true,
            emailAccount: foundUser.gmailAlias,
            aliases: processedAliases
        })

    } catch (error) {
        console.log(error)
        return ({
            connected: false,
            emailAccount: 'error'
        })
    }
}

export async function writeNewAlias(alias) {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await mongodbClient.connect();
        const database = await mongodbClient.db('users');
        const userCollection = await database.collection('userData');

        const query = { userId: userId };
        var updatedUser = await userCollection.updateOne(query, {
            $set: {
                gmailAlias: alias
            },
        });
        mongodbClient.close();
    } catch (error) {
        console.log('Failed to change alias')
        mongodbClient.close();
    }

    revalidatePath('/linkaccount')
}

export async function checkIfEmailConnected() {
    noStore();

    const unipileClient = new UnipileClient(process.env.UNI_URI, process.env.UNI_API_KEY)
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await mongodbClient.connect();
        const database = await mongodbClient.db('users');
        const userCollection = await database.collection('userData');
        const query = { userId: userId };
        var foundUser = await userCollection.findOne(query);
        await mongodbClient.close(); //close connection

        // check if user doesn't exist, or no unipile account connected
        console.log('checking account id')
        if (foundUser === null || !foundUser.unipileAccountId || foundUser.unipileAccountId === 'NULL') {
            console.log("User not found")
            return ({
                connected: false,
                emailAccount: "does_not_matter"
            })
        } else {
            console.log("FOUND USER IN DATABASE!");
        }

        // grab email address
        const unipileResults = await unipileClient.account.getAll(foundUser.unipileAccountId)

        /*
            Unipile's API is very weird, any request to grab a specific account with and ID will result in 
                every account under the unipile account being returned?
        */

        const actualUserObject = unipileResults.items.find(trav => {
            return trav.id === foundUser.unipileAccountId
        })
        return ({
            connected: true,
            emailAccount: actualUserObject.name
        })
    } catch (error) {
        console.log(error)
        return ({
            connected: false,
            emailAccount: 'error'
        })
    }
}

/*
    user connects email:
        db -> userId => unipileAccountId (that will be used to make requests)
    when checking if user connected:
        -> db + userId => is unipileAccountId
*/

// used for parsing file buffer to json
async function convertCsvBufferToJson(csvBuffer) {
    // Convert the buffer to a string
    const csv = require('csvtojson');
    const csvString = csvBuffer.toString('utf8');

    // Use csvtojson to convert the string to JSON
    try {
        const jsonObj = await csv().fromString(csvString);
        const filterBadData = jsonObj.filter((e) => {
            return e.Email && e['Person Linkedin Url']
        })
        const processData = filterBadData.map((e) => {
            return { email: e.Email, linkedin: e['Person Linkedin Url'] }
        })
        return processData; // This is an array of objects

    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error; // Rethrow or handle error as needed
    }
}

export async function processFile(prevState, formData) {
    noStore();
    var retObj = { parsedArray: null, error: null }

    console.log(formData)

    //reset form
    if (formData.type && formData.type === 'RESET') {
        return formData.payload;
    }

    //check if file is not upload
    if (formData.get("file").name === 'undefined') {
        console.log('no file uploaded')
        retObj.error = 'no_file_upload'
        return retObj
    }

    if(formData.get("sequence") === 'No sequences created') {
        console.log("error")
        retObj.error = 'no_sequence_created'
        return retObj
    }

    console.log(formData)

    //check if email is connected
    //var checkEmailConnected = await checkIfEmailConnected() // HAD TO CHANGE TO TEMPORARILY DEPRECATE UNIPILE, will reverse soon ;)
    var checkEmailConnected = await checkIfGmailIsConnected()
    if (!checkEmailConnected.connected) {
        console.log('email not connected')
        retObj.error = 'no_email_connected'
        return retObj 
    }

    //new file uploaded
    const file = formData.get("file");
    try {
        const file_parsed = await convertCsvBufferToJson(Buffer.from(await file.arrayBuffer()));

        // no entries
        if (file_parsed.length === 0) {
            retObj.error = "not_csv_or_no_columns"
            return retObj
        }

        // too many entries 
        if (file_parsed.length > 200) {
            retObj.error = "too_many_entries"
            return retObj
        }

        retObj.parsedArray = file_parsed
    } catch (error) {
        retObj.error = "file_failed_parse"
    }
    return retObj;
}

//handle sequence modifications + creation of new ones
export async function processSequences(prevState, formData) {
    noStore();
    var retObj = { parsedArray: null, error: null }
    //check if both fields are full
    if (formData.get('sequence_name') == '') {
        console.log('HERE!')
        retObj.error = 'NO_SEQUENCE_NAME'
        return retObj;
    }
    if (formData.get('subject_line') == '') {
        retObj.error = 'NO_SUBJECT_LINE'
        return retObj;
    }
    //save it to the database (likely need error check for steps)
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        await mongodbClient.connect()
        var timestamp = new Date().getTime();
        const database = mongodbClient.db('users')
        const sequenceCollection = await database.collection('emailSequences')
        const savedEmailSequence = {
            userId: userId,
            sequenceName: formData.get('sequence_name') + "@" + timestamp,
            steps: [] //need to update this later with the state stuff
        }
        await sequenceCollection.insertOne(savedEmailSequence)
        retObj.status = "JUST_SAVED" //show the user it was saved
        await mongodbClient.close()
    } catch (error) {
    }
    return retObj;
}

export async function createNewSequence(newSequenceName, goal) {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    var timestamp = new Date().getTime();
    const seqName = newSequenceName + "@" + timestamp;
    //save sequence
    try {
        await mongodbClient.connect()
        const database = mongodbClient.db('users')
        const sequenceCollection = await database.collection('emailSequences')
        const savedEmailSequence = {
            userId: userId,
            sequenceName: seqName,
            goal: goal,
            steps: [] //need to update this later with the state stuff
        }
        await sequenceCollection.insertOne(savedEmailSequence)
        await mongodbClient.close()
    } catch (error) {

    }
    //re-direct to edit page
    redirect(`/aisequences/editsequence?sequenceName=${encodeURIComponent(seqName)}`)
}

export async function grabSequenceData(sequenceName) {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    var timestamp = new Date().getTime();
    const seqName = sequenceName + "@" + timestamp;

    const query = {
        userId: userId,
        sequenceName: sequenceName
    }
    var grabbedObj = {}
    
    console.log("JDFKDSHFKDHFKDSJHFJKDSH")
    console.log(query)

    //save sequence
    try {
        await mongodbClient.connect()
        const database = mongodbClient.db('users')
        const sequenceCollection = await database.collection('emailSequences')
        grabbedObj = await sequenceCollection.findOne(query);
        await mongodbClient.close()
    } catch (error) {

    }

    return JSON.parse(JSON.stringify(grabbedObj));
}

export async function saveStep(sequenceName, stepName, stepTemplate, stepExampleSubjectLines, stepExampleBodys, subjectLine, position = -1) {
    console.log("Position:")
    console.log(position)
    console.log("Subject Line:")
    console.log(subjectLine)

    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    var timestamp = new Date().getTime();

    const query = {
        userId: userId,
        sequenceName: sequenceName
    }

    await mongodbClient.connect()
    const database = mongodbClient.db('users')
    const sequenceCollection = await database.collection('emailSequences')
    console.log("sdjfkhsdf")
    console.log(position)

    try {
        if (position == -1) {
            //grab and update
            var grabbedObj = await sequenceCollection.findOne(query);
            var newStepArray = grabbedObj.steps === null ? [] : grabbedObj.steps
            newStepArray.push({
                step_name: stepName,
                step_subject_line: subjectLine,
                step_template: stepTemplate,
                step_example_subject_lines: stepExampleSubjectLines,
                step_example_bodys: stepExampleBodys,
            })
            const updateDoc = {
                $set: {
                    steps: newStepArray
                },
            }
            const updatedUser = await sequenceCollection.updateOne(query, updateDoc);
            await mongodbClient.close()
        } else {
            //editing step
            console.log("EDITING")
            var grabbedObj = await sequenceCollection.findOne(query);
            grabbedObj = grabbedObj.steps.map((trav, index) => {
                if (index != position) {
                    return trav
                }
                return ({
                    step_name: stepName,
                    step_subject_line: subjectLine,
                    step_template: stepTemplate,
                    step_example_subject_lines: stepExampleSubjectLines,
                    step_example_bodys: stepExampleBodys,
                })
            })
            const updateDoc = {
                $set: {
                    steps: grabbedObj
                },
            }
            const updatedUser = await sequenceCollection.updateOne(query, updateDoc);
            await mongodbClient.close()
        }
    }
    catch (error) {
        console.log(error)
        return; //dont redirect
    }
    redirect(`/aisequences/editsequence?sequenceName=${encodeURIComponent(sequenceName)}`)
}

export async function removeStep(sequenceName, stepPosition) {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const query = {
        userId: userId,
        sequenceName: sequenceName
    }
    await mongodbClient.connect()
    const database = mongodbClient.db('users')
    const sequenceCollection = await database.collection('emailSequences')
    try {
        //removing step
        console.log("EDITING")
        var grabbedObj = await sequenceCollection.findOne(query);
        grabbedObj = grabbedObj.steps.filter((trav, index) => {
            if (index != stepPosition) {
                return true
            } 
            return false
        })
        const updateDoc = {
            $set: {
                steps: grabbedObj
            },
        }
        const updatedUser = await sequenceCollection.updateOne(query, updateDoc);
        await mongodbClient.close()
    }
    catch (error) {
        console.log(error)
        return; //dont redirect
    }
    redirect(`/aisequences/editsequence?sequenceName=${encodeURIComponent(sequenceName)}`)
}


export async function grabEmailSequences() {
    noStore();
    const { userId } = auth();
    const mongodbClient = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const query = {
        userId: userId,
    }
    await mongodbClient.connect()
    const database = await mongodbClient.db('users')
    const sequenceCollection = await database.collection('emailSequences')
    try {
        var allUserSequences = await sequenceCollection.find(query);
        var allSequences = await allUserSequences.toArray()
        allSequences = allSequences.map((e) => {console.log(e) 
            return ({sequenceName: e.sequenceName, size: e.steps.length})})
        console.log(allSequences)
        await mongodbClient.close()
        return allSequences;
    }
    catch (error) {
        console.log("error")
        console.log(error)
        await mongodbClient.close()
        return; //dont redirect
    }
}