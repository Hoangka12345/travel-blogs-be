import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
    private readonly userSocketMap = new Map<string, string>();

    setUserSocket(userId: string, socketId: string) {
        this.userSocketMap.set(userId, socketId);
    }

    getUserSocket(userId: string): string | undefined {
        return this.userSocketMap.get(userId);
    }

    removeUserSocket(userId: string) {
        this.userSocketMap.delete(userId);
    }
}
