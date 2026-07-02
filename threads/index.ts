import "expo-router/entry"; // mock 서버를 사용하기 위한 package.json 을 커스텀 경로로 로드하도록 적용

import {createServer, Server} from "miragejs";

declare global {
    interface Window {
        server: Server;
    }
}

interface Window {
    server: any;
}

if (__DEV__) {
    if (window.server) {
        window.server.shutdown();
    }

    window.server = createServer({
        routes() {
            this.get("/login", () => {
                return {
                    isSuccess: true,
                    accessToken: "access-token",
                    refreshToken: "refresh-token",
                    user: {
                        id: "mock-user-id"
                    }
                }
            })
        }
    });
}