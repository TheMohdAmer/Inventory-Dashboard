import { demoInventory } from "../data/demoInventory";
import { demoUsers } from "../data/demoUsers";

export function initializeLocalStorage() {
  if (!localStorage.getItem("inventory")) {
    localStorage.setItem(
      "inventory",
      JSON.stringify(demoInventory)
    );
  }

  if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify(demoUsers)
    );
  }
}