'use server';

import { UnipileClient } from 'unipile-node-sdk';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

export async function getNewHostedAuthLink() {
    noStore();
    const client = new UnipileClient(process.env.UNI_URI, process.env.UNI_API_KEY)
    const response = await client.account.createHostedAuthLink({
        type: "create",
        api_url: process.env.UNI_URI,
        expiresOn: "2024-12-22T12:00:00.701Z",
        providers: ["GOOGLE"],
        success_redirect_url: "http://localhost:3000/linkaccount"
    })

    redirect(response.url)
}

export async function checkIfEmailConnected() {
    noStore();
    const client = new UnipileClient(process.env.UNI_URI, process.env.UNI_API_KEY)
    const response = await client.account.getAll()
    if (response.items.length > 0) {
        return {
            connected: true,
            emailAccount: response.items[0].name
        }
    } else {
        return {
            connected: false,
            emailAccount: "does not matter"
        }
    }
}

// used for parsing file buffer to json
async function convertCsvBufferToJson(csvBuffer) {
    // Convert the buffer to a string
    const csv = require('csvtojson');
    const csvString = csvBuffer.toString('utf8');

    // Use csvtojson to convert the string to JSON
    try {

        const jsonObj = await csv().fromString(csvString);
        const processData = jsonObj.map((e) => {
            return { email: e.email, linkedin: e.linkedin }
        })
        return processData; // This is an array of objects

    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error; // Rethrow or handle error as needed
    }
}

export async function processFile(prevState, formData) {
    console.log(formData)
    const file = formData.get("file");
    var retObj = { parsedArray: null, errors: {} }
    console.log(file)
    console.log(file.name);
    console.log(file.size);
    const fs = require('fs');
    try {
        retObj.parsedArray = await convertCsvBufferToJson(Buffer.from(await file.arrayBuffer()));
    } catch {
        //error handling
    }

    console.log(retObj)
    return retObj;
}
