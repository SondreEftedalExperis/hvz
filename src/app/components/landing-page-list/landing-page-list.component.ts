import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Game } from "src/app/models/game.model";
import { User } from "src/app/models/user.model";
import { GameService } from "src/app/services/game.service";
import { UserService } from "src/app/services/user.service";
import{faTrash} from "@fortawesome/free-solid-svg-icons"
@Component({
  selector: 'app-landing-page-list',
  templateUrl: './landing-page-list.component.html',
  styleUrls: ['./landing-page-list.component.css']
})
export class LandingPageListComponent implements OnInit{
  @Input() games: Game[] = [];

  _user: User;
  faTrash = faTrash
 
  constructor(
    private readonly gameService: GameService,
    private readonly userService: UserService,
    private readonly router: Router){}

  async goToGame(game: Game){
    //console.log(game)
    this.gameService.game = game;
    this.router.navigateByUrl("/game-detail")
  }

  ngOnInit() {
      this._user = this.userService.userResponse;
      this.gameService.getGames()
      console.log(this.gameService.games)
      this.gameService.games.forEach(game=>
          this.gameService.getNumberOfPlayersInGame(game.id)
        )
  }

  timeToReadable(date: string): string {
    const d = new Date(date);
    return d.toLocaleString("no");
  }

  deleteGame(game:Game){
    this.gameService.deleteGame(game)
  }
}
