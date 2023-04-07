import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id:string]:{
        socket: Socket,
        user:User
    }
}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    private connectedClients:ConnectedClients = {}

    async registerClient(client:Socket,id:string){

        const user = await this.userRepository.findOneBy({id})

        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User not active');

        this.checkUserConnection(user);

        this.connectedClients[client.id] = {
            socket:client,
            user
        }
    }

    removeClient(clientId:string){
        delete this.connectedClients[clientId]
    }

    getConnectedClients():string[]{
        return Object.keys(this.connectedClients);
    }

    getUserFullNameBySocketId(id:string){
        return this.connectedClients[id].user.fullName
    }

    private checkUserConnection(user:User){

        for (const clientId of this.getConnectedClients()) {
            
            const connectedClient = this.connectedClients[clientId]

            if(connectedClient.user.id === user.id){
                connectedClient.socket.disconnect();
                break;
            }

        }

    }

}
