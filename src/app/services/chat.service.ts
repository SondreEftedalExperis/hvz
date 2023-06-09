import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from 'src/environments/environment';
import keycloak from 'src/keycloak';
import { Chat, ChatDTO } from '../models/chat.model';
import { PlayerService } from './player.service';

const { apiUrl } = environment


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _loading = false;
  private _chats: Chat[] = []

  constructor(private readonly http: HttpClient, private readonly playerService:PlayerService) { }
  get chats() {
    return this._chats;
  }
  get loading() {
    return this._loading;
  }


  public sendChat(chat: ChatDTO, gameId: number) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + keycloak.token)

    return this.http.post<Chat>(`${apiUrl}/game/${gameId}/chat`, chat, {'headers': headers })
      .pipe(
        finalize(() => {
          this._loading = false;
        })
      )
      .subscribe((chat: Chat) => {
        this._chats.push(chat);
      })
  }


  public getChat(gameId: number) {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + keycloak.token);

    return this.http.get<Chat[]>(`${apiUrl}/game/${gameId}/chat`, {'headers': headers})
      .pipe(
        finalize(() => {
          this._loading = false;
        })
      )
      .subscribe((chats: Chat[]) => {

        this._chats = chats;
      })
  }

  public deleteChat(chat:Chat){
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + keycloak.token)
    this.http.delete(`${apiUrl}/game/${chat.gameId}/chat/${chat.id}`, {'headers': headers})
    .subscribe(() => {
      this._chats = this._chats.filter(c => c.id !== chat.id)
    })
  }

}
