import { Client, Account, Avatars, Databases } from 'react-native-appwrite';

export const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6833f2fc00265d05a7a1')
    .setPlatform('dev.saajminn.NUSUniWash');

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
