import { MongoClient } from 'mongodb'

export async function GET() {
    return Response.json({ status: 'hello world' })
}

export const dynamic = 'force-dynamic' // defaults to auto

// exposed endpoint from unipile
export async function POST(request) {
    // Parse the form data from the request
    const body = await request.json();
    console.log(body);

    const userId = body.name
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
                unipileAccountId: body.account_id
            }
            foundUser = await userCollection.insertOne(newUserDoc);
            console.log(`a new user document was inserted with the _id: ${foundUser.insertedId}`);
        } else {
            //update the user with the new unipile add
            const updateDoc = {
                $set: {
                    unipileAccountId: body.account_id
                },
            }
            const updatedUser = await userCollection.updateOne(query, updateDoc);
            console.log('Already found user, update a success!')
            console.log(updatedUser);
        }

        //can early return at that point
        return new Response(JSON.stringify({}), {
            status: 200
        });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({}), {
            status: 501 //bad processing
        });
    }

    // General Logic

    /*
     {
        status: 'CREATION_SUCCESS',
        account_id: 'UNIPILE_ID',
        name: 'CLERK_ID'
      }
    */

    /*
      1. if doesn't have account, create one (check if this interferes with other logic)
      - create one with this schema: 
            const newUserDoc = {
                userId: userId,
                jobs: [],
                unipileAccountId: body.account_id
            }

      2. If it does exist, you can always overwrite
            1. find account
            2. use set to update/create the unipileAccountId to body.account_id
    */
}