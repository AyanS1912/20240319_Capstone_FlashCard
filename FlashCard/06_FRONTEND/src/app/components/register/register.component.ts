import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { RegisterService } from "../../services/auth/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(
        /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/
      ),
    ]),
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z0-9]{4,20}$/),
    ]),
  });

  usernameInputFocused: boolean = false;
  emailInputFocused: boolean = false;
  passwordInputFocused: boolean = false;

  onFocus(controlName: string) {
    if (controlName === "userName") {
      this.usernameInputFocused = true;
    } else if (controlName === "email") {
      this.emailInputFocused = true;
    } else if (controlName === "password") {
      this.passwordInputFocused = true;
    }
    console.log(
      this.emailInputFocused,
      this.usernameInputFocused,
      this.passwordInputFocused
    );
  }

  onBlur(controlName: string) {
    if (controlName === "userName") {
      this.usernameInputFocused = false;
    } else if (controlName === "email") {
      this.emailInputFocused = false;
    } else if (controlName === "password") {
      this.passwordInputFocused = false;
    }
    console.log(
      this.emailInputFocused,
      this.usernameInputFocused,
      this.passwordInputFocused
    );
  }

  constructor(
    private registerService: RegisterService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const userData = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      username: this.registerForm.value.username,
    };
    console.log(userData);

    this.registerService.register(userData).then(
      () => {
        // Registration successful
        console.log("Registration successful");
      },
      (error) => {
        // Registration failed
        console.error("Registration failed:", error);
      }
    );
  }
}
