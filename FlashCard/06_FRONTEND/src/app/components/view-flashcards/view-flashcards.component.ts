import { Component, OnInit, Input, Output, EventEmitter  } from "@angular/core";
import { FlashcardServiceService } from "../../services/flashcard/flashcard-service.service";
import { Flashcard } from "../../interface/flashcardInterface";
import { Router } from "@angular/router";
import { VoteService } from "../../services/vote/vote.service";
import { RegisterService } from "../../services/auth/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: "app-view-flashcards",
  templateUrl: "./view-flashcards.component.html",
  styleUrl: "./view-flashcards.component.css",
})
export class ViewFlashcardsComponent implements OnInit {
  allflashcards: Flashcard[] = [];
  @Input() userDetails: any;
  htmlFrontText: any = '';
  htmlBackText: any = '';
  @Output() createCard: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private flashcardService: FlashcardServiceService,
    private router: Router,
    private voteService: VoteService,
    private userService: RegisterService,
    private snackBar : MatSnackBar,
    private dialog : MatDialog,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
    this.initializeFlipCards();
    this.fetchFlashcards();
  }

  // Method to fetch user details
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

  // Method to initialize flip cards
  initializeFlipCards(): void {
    const flipCards = document.querySelectorAll(".flip-card-click");

    flipCards.forEach((card) => {
      card.addEventListener("click", function () {
        card.classList.toggle("flipped");
      });
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  
  // Method to fetch flashcards
  fetchFlashcards() {
    this.flashcardService.getAllFlashcards().then(
      (data: any) => {
        this.allflashcards = data.data;
        this.allflashcards.forEach(flashcard => {
          this.htmlFrontText = flashcard.frontText;
          this.htmlBackText = flashcard.backText
          console.log(this.htmlFrontText, this.htmlBackText)
        })
        this.fetchUserVotes();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // Method to fetch user votes for flashcards
  fetchUserVotes(): void {
    for (const flashcard of this.allflashcards) {
      this.voteService.getVotesForFlashcard(flashcard._id).then(
        (votes: any[]) => {
          const userVote = votes.find(
            (vote) => vote.userId === this.userDetails._id
          );
          if (userVote) {
            flashcard.userVoteType = userVote.voteType;
          } else {
            flashcard.userVoteType = "";
          }
          flashcard.upvotes = votes.filter(
            (vote) => vote.voteType === "upvote"
          ).length;
          flashcard.downvotes = votes.filter(
            (vote) => vote.voteType === "downvote"
          ).length;
        },
        (error) => {
          console.error("Failed to fetch votes for flashcard:", error);
        }
      );
    }
  }

  // Method to navigate to edit flashcard page
  editFlashcard(flashcardId: string) {
    console.log("clicked");

    // Navigate to the edit page with the flashcard ID as a parameter
    this.router.navigate(["/edit-flashcard", flashcardId]);
  }

  // Method to delete a flashcard
  deleteFlashcard(flashcardId: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '250px',
      data: { title: 'Confirm Deletion', message: 'Are you sure you want to delete this flashcard?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion
        this.flashcardService.deleteFlashcard(flashcardId).then(
          (res) => {
            this.snackBar.open("Flashcard deleted successfully", "", {
              duration: 3000,
            });
            console.log("Flashcard deleted successfully:", res);
            // Reload flashcards after deletion
            this.fetchFlashcards();
          },
          (error) => {
            // Handle error
            console.error("Failed to delete Flashcard :", error);
            this.snackBar.open("Failed to delete Flashcard", "", {
              duration: 3000,
            });
          }
        );
      }
    });
  }

  // Method to upvote a flashcard
  upvoteFlashcard(flashcardId: string): void {
    // Call the upvoteFlashcard() API method
    this.voteService.upvoteFlashcard(flashcardId).then(
      (res) => {
        console.log("Flashcard upvoted successfully:", res);
        this.snackBar.open("Flashcard upvoted successfully", "", {
          duration: 3000,
        });
        // Reload flashcards after upvote
        this.fetchFlashcards();
      },
      (error) => {
        console.error("Failed to upvote Flashcard:", error);
        this.snackBar.open("Failed to upvote Flashcard", "", {
          duration: 3000,
        });
      }
    );
  }

  downvoteFlashcard(flashcardId: string): void {
    // Call the downvoteFlashcard() API method
    this.voteService.downvoteFlashcard(flashcardId).then(
      (res) => {
        console.log("Flashcard downvoted successfully:", res);
        this.snackBar.open("Flashcard downvoted successfully", "", {
          duration: 3000,
        });
        // Reload flashcards after downvote
        this.fetchFlashcards();
      },
      (error) => {
        console.error("Failed to downvote Flashcard:", error);
        this.snackBar.open("Failed to downvote Flashcard", "", {
          duration: 3000,
        });
      }
    );
  }

  OncreateFlashcardClicked(){
    this.createCard.emit()
  }

}
