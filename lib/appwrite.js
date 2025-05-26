import { Client, Account, Avatars } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6833f2fc00265d05a7a1')
    .setPlatform('dev.saajid.NUSUniWash');

    export const account = new Account(client)
    export const avatar = new Avatars(client)