'use server';

import { UnipileClient } from 'unipile-node-sdk';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';

export async function getNewHostedAuthLink() {
    noStore();
    const client = new UnipileClient("NO HACKERS", "NO HACKERS")
    const response = await client.account.createHostedAuthLink({
        type: "create",
        api_url: "https://api2.unipile.com:13237",
        expiresOn: "2024-12-22T12:00:00.701Z",
        providers: ["GOOGLE"],
        success_redirect_url: "http://localhost:3000/linkaccount"
    })

    redirect(response.url)
}

export async function checkIfEmailConnected() {
    noStore();
    const client = new UnipileClient("NO HACKERS", "NO HACKERS")
    const response = await client.account.getAll()
    if(response.items.length > 0) {
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
