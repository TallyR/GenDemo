'use server';

import { UnipileClient } from 'unipile-node-sdk';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { MongoClient } from 'mongodb'
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

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
        const query = { userId: userId };
        var foundUser = await userCollection.findOne(query);
        if (foundUser === null) {
            return []; // no jobs or user created yet
        }
        return foundUser.jobs;
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
        const jobCollection = await database.collection('jobsQueue');
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
            userId: foundUserOrNeedToCreateOne.userId
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

    //check if email is connected
    var checkEmailConnected = await checkIfEmailConnected()
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
        if (file_parsed.length > 30) {
            retObj.error = "too_many_entries"
            return retObj
        }

        retObj.parsedArray = file_parsed
    } catch (error) {
        retObj.error = "Failed to parse"
    }
    return retObj;
}
