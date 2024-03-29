import { Component , Input, OnInit} from '@angular/core';
import { Deck } from '../../interface/deckInterface';
import { DeckService } from '../../services/auth/deck.service';
import { RegisterService } from '../../services/auth/user.service';

@Component({
  selector: 'app-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrl: './deck-card.component.css'
})
export class DeckCardComponent implements OnInit {
  // @Input() deck!: Deck;
  decks: Deck[] = []; 
  mydecks : Deck[] = []
  userDetails : any;

  constructor( private deckService : DeckService,
    private userService : RegisterService) {}
  
  ngOnInit(): void {
    this.getUserDetails();
    this.loadDecks();
  }

  loadDecks() {
    this.deckService.getAllDecks().then(
      (decks : any) => {
        this.decks = decks.data;
        console.log(this.decks)
      },
      (error) => {
        console.error('Failed to fetch decks:', error);
      }
    );
  }

  getUserDetails() {
    this.userService.getUserDetails().then(
      (data) => {
        this.userDetails = data;
        // console.log(this.userDetails)
      },
      (error) => {
        console.error("Failed to fetch user details:", error);
      }
    );
  }
  // editDeck(deckId : string) {
  //   // Call the updateDeck() API method
  //   this.deckService.updateDeck(deckId).then(
  //     (res) => {
  //       // Handle success
  //       console.log('Deck updated successfully:', res);
  //       // Reload decks after update
  //       this.loadDecks();
  //     },
  //     (error) => {
  //       // Handle error
  //       console.error('Failed to update deck:', error);
  //     }
  //   );
  // }

  deleteDeck(deckId: string) {
    // Call the deleteDeck() API method
    this.deckService.deleteDeck(deckId).then(
      (res) => {
        // Handle success
        console.log('Deck deleted successfully:', res);
        // Reload decks after deletion
        this.loadDecks();
      },
      (error) => {
        // Handle error
        console.error('Failed to delete deck:', error);
      }
    );
  }
}
