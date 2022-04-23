declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_SERVER_URL: string; // this is the line you want
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
        }
    }
}

export { }