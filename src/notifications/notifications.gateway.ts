import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3002, {
    cors: {
        origin: 'http://localhost:3001', // Indirizzo del frontend
        credentials: true,
    },
})
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        console.log('WebSocket initialized');
    }

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }
    @SubscribeMessage('sendNotification')
    handleNotification(@MessageBody() data: any) {
        console.log('New notification received:', data);
        if (this.server) {
            console.log('Emitting new notification:', data);
            this.server.emit('newNotification', data);
        } else {
            console.error('Server instance is not available');
        }
    }
}
