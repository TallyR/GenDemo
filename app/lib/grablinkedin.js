"use server";

import axios from 'axios';

// grab company data
async function grabCompanyData(linkedinUrl) {
    const api_key = process.env.PROXY_CURL_API_KEY;
    const headers = {
        Authorization: 'Bearer ' + api_key
    };
    const api_endpoint = 'https://nubela.co/proxycurl/api/linkedin/company';
    const params = {
        'url': linkedinUrl,
        'resolve_numeric_id': true,
        'categories': 'exclude',
        'funding_data': 'exclude',
        'exit_data': 'exclude',
        'acquisitions': 'exclude',
        'extra': 'exclude',
        'use_cache': 'if-present',
        'fallback_to_cache': 'on-error',
    }
    const r = await axios.get(api_endpoint, { params, headers });
    //console.log(r.data.description);
    return r;
}

// to grab the linkedin profile
export async function fetchLinkedInProfile(linkedinUrl) {

    const api_key = process.env.PROXY_CURL_API_KEY;
    const headers = {
        Authorization: 'Bearer ' + api_key
    };
    const api_endpoint = 'https://nubela.co/proxycurl/api/v2/linkedin';
    const params = {
        'linkedin_profile_url': linkedinUrl,
        'extra': 'exclude',
        'github_profile_id': 'exclude',
        'facebook_profile_id': 'exclude',
        'twitter_profile_id': 'exclude',
        'personal_contact_number': 'exclude',
        'personal_email': 'exclude',
        'inferred_salary': 'exclude',
        'skills': 'exclude',
        'use_cache': 'if-recent',
        'fallback_to_cache': 'on-error',
    };

    const r = await axios.get(api_endpoint, { params, headers });
    const response = r.data;
    const currentCompanyData = r.data.experiences && r.data.experiences[0] && r.data.experiences[0].company_linkedin_profile_url ? await grabCompanyData(r.data.experiences[0].company_linkedin_profile_url) : null

    const filteredData = {
        name: response.full_name,
        occupation: response.occupation,
        country_full_name: response.country_full_name,
        city: response.city,
        state: response.state,
        recipient_self_headline: response.headline ? response.headline : "",
        recipient_self_summary: response.summary ? response.summary : "",
        experiences: response.experiences ? response.experiences.map((trav) => {
            return {
                company: trav.company,
                title: trav.title,
                description: trav.description ? trav.description : '',
                location: trav.location ? trav.location : ''
            }
        }) : [],
        education: response.education ? response.education.map((trav) => {
            return {
                degree_name: trav.degree_name ? trav.degree_name : '',
                school: trav.school ? trav.school : '',
                description: trav.description ? trav.description : ''
            }
        }) : [],
        currentCompanyDescription: {
            name: currentCompanyData && currentCompanyData.data && currentCompanyData.data.name ? currentCompanyData.data.name : '',
            description: currentCompanyData && currentCompanyData.data && currentCompanyData.data.description ? currentCompanyData.data.description : ''
        }
    }

    return filteredData;
}