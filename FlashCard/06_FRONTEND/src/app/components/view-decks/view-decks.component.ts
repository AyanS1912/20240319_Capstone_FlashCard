import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Deck } from "../../interface/deckInterface";
import { DeckService } from "../../services/deck/deck.service";
import { RegisterService } from "../../services/auth/user.service";
import { Router } from "@angular/router";
import { VoteService } from "../../services/vote/vote.service";

@Component({
  selector: "app-view-decks",
  templateUrl: "./view-decks.component.html",
  styleUrl: "./view-decks.component.css",
})
export class ViewDecksComponent {
  // @Input() deck!: Deck;
  mydeckCardDecks: Deck[] = [];
  userData: any;
  @Output() createDeck: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private deckService: DeckService,
    private userService: RegisterService,
    private router: Router,
    private voteService: VoteService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  // Method to fetch user details and load decks
  getUserDetails() {
    this.userService.getUserDetails().then(
      (data) => {
        this.userData = data;
        this.loadDecks();
      },
      (error) => {
        console.error("Failed to fetch user details:", error);
      }
    );
  }

  // Method to load decks associated with the current user
  loadDecks() {
    this.deckService.getAllDecks().then(
      (decks: any) => {
        this.mydeckCardDecks = decks.data;
        this.mydeckCardDecks = this.mydeckCardDecks.filter(
          (deck) => deck.userId.toString() === this.userData._id.toString()
        );
        this.fetchUserVotes();
      },
      (error) => {
        console.error("Failed to fetch decks:", error);
      }
    );
  }

  // Method to fetch votes for each deck
  fetchUserVotes(): void {
    console.log(this.mydeckCardDecks);
    for (const deck of this.mydeckCardDecks) {
      this.voteService
        .getVotesForDeck(deck._id)
        .then((votes: any[]) => {
          const userVote = votes.find(
            (vote) => vote.userId === this.userData._id
          );
          if (userVote) {
            deck.userVoteType = userVote.voteType;
          } else {
            deck.userVoteType = "";
          }
          console.log(deck.userVoteType)
          deck.upvotes = votes.filter(
            (vote) => vote.voteType === "upvote"
          ).length;
          deck.downvotes = votes.filter(
            (vote) => vote.voteType === "downvote"
          ).length;
        })
        .catch((error) => {
          console.error("Failed to fetch votes for deck:", error);
        });
    }
  }

  // Method to reload decks
  reloadDecks() {
    this.loadDecks();
  }

  onCreateDeckClicked() {
    this.createDeck.emit();
  }

}
