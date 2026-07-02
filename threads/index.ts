import "expo-router/entry"; // mock 서버를 사용하기 위한 package.json 을 커스텀 경로로 로드하도록 적용

import {createServer, Server, Response} from "miragejs";

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
            this.post("/login", (schema, request) => {
                const {username, password} = JSON.parse(request.requestBody);
                if (username === "testusername" && password === "testpw") {
                    return {
                        isSuccess: true,
                        accessToken: "access-token",
                        refreshToken: "refresh-token",
                        user: {
                            id: "mock-user-id",
                            description: "mock user description",
                            username: "testusername",
                            profileImageUrl: "https://phinf.pstatic.net/contact/20251015_27/1760533359414CszI3_JPEG/%C0%AF%C5%E4.jpg?type=f130_130"
                        }
                    };
                }

                return new Response(401, {}, {
                    message: "Invalid credentials"
                });
            });
        }
    });
}