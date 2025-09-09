import { getFromLocalStorage } from "/js/utils/local-storage.mjs";
import { placeBidOnListing } from "/js/api/auction-listings.mjs";
import { showError } from "/js/shared/error-handling.mjs";
import { showSuccess } from "/js/shared/success-handling.mjs";
import { ItemInfoRenderer } from "./item-info-renderer.mjs";
import { BidHistoryRenderer } from "./bid-history-renderer.mjs";

export class BidManager {
  constructor(itemData) {
    this.itemData = itemData;
    this.isLoggedIn = !!getFromLocalStorage("accessToken");
    this.isAuctionEnded = new Date(itemData.endsAt) <= new Date();

    this.bidForm = document.getElementById("place-bid-form");
    this.bidAmountInput = document.getElementById("bid-amount");
    this.placeBidButton = document.getElementById("place-bid-button");
    this.minimumBidText = document.getElementById("minimum-bid");

    this.initialize();
  }

  initialize() {
    this.setupBidInterface();
    this.setupEventListeners();
    this.updateMinimumBid();
  }

  setupBidInterface() {
    const bidFormContainer = document.getElementById("bid-form");
    const loginPrompt = document.getElementById("login-prompt");
    const auctionEnded = document.getElementById("auction-ended");

    [bidFormContainer, loginPrompt, auctionEnded].forEach((el) => {
      if (el) el.classList.add("hidden");
    });

    if (this.isAuctionEnded) {
      if (auctionEnded) auctionEnded.classList.remove("hidden");
    } else if (this.isLoggedIn) {
      if (bidFormContainer) bidFormContainer.classList.remove("hidden");
    } else {
      if (loginPrompt) loginPrompt.classList.remove("hidden");
    }
  }

  setupEventListeners() {
    if (this.bidForm) {
      this.bidForm.addEventListener("submit", (e) =>
        this.handleBidSubmission(e),
      );
    }

    if (this.bidAmountInput) {
      this.bidAmountInput.addEventListener("input", () =>
        this.validateBidAmount(),
      );
    }
  }

  updateMinimumBid() {
    if (!this.minimumBidText) return;

    const currentHighestBid = this.getCurrentHighestBid();
    const minimumBid = currentHighestBid + 1;

    this.minimumBidText.textContent = `Minimum bid: ${minimumBid} credits`;

    if (this.bidAmountInput) {
      this.bidAmountInput.min = minimumBid;
      this.bidAmountInput.placeholder = `Minimum: ${minimumBid} credits`;
    }
  }
  getCurrentHighestBid() {
    if (!this.itemData.bids || this.itemData.bids.length === 0) {
      return 0;
    }
    return Math.max(...this.itemData.bids.map((bid) => bid.amount));
  }
  validateBidAmount() {
    if (!this.bidAmountInput || !this.placeBidButton) return;

    const bidAmount = parseInt(this.bidAmountInput.value);
    const minimumBid = this.getCurrentHighestBid() + 1;
    const isValid = bidAmount >= minimumBid;

    this.placeBidButton.disabled = !isValid;

    if (bidAmount && !isValid) {
      this.bidAmountInput.classList.add("border-red-500");
      this.minimumBidText.classList.add("text-red-600");
    } else {
      this.bidAmountInput.classList.remove("border-red-500");
      this.minimumBidText.classList.remove("text-red-600");
    }
  }
  async handleBidSubmission(event) {
    event.preventDefault();

    if (!this.isLoggedIn) {
      showError("Please log in to place a bid", "#bid-form");
      return;
    }

    if (this.isAuctionEnded) {
      showError("This auction has ended");
      return;
    }

    const bidAmount = parseInt(this.bidAmountInput.value);
    const minimumBid = this.getCurrentHighestBid() + 1;

    if (bidAmount < minimumBid) {
      showError(`Bid must be at least ${minimumBid} credits`);
      return;
    }

    try {
      this.placeBidButton.disabled = true;
      this.placeBidButton.textContent = "Placing Bid...";

      console.log(
        `Placing bid of ${bidAmount} credits on item ${this.itemData.id}`,
      );

      const result = await placeBidOnListing(this.itemData.id, bidAmount);

      if (result) {
        showSuccess(`Bid of ${bidAmount} credits placed successfully!`, null, {
          isToast: true,
          duration: 5000,
        });

        this.itemData.bids = this.itemData.bids || [];
        this.itemData.bids.unshift({
          id: result.id,
          amount: bidAmount,
          bidder: {
            name: getFromLocalStorage("userName") || "You",
            email: getFromLocalStorage("userEmail") || "",
          },
          created: new Date().toISOString(),
        });

        this.updateAfterBid();
        this.bidAmountInput.value = "";
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      showError(
        error.message || "Failed to place bid. Please try again",
        "#bid-form",
      );
    } finally {
      this.placeBidButton.disabled = false;
      this.placeBidButton.textContent = "Place Bid";
    }
  }

  updateAfterBid() {
    ItemInfoRenderer.renderBidInfo(
      this.itemData.bids,
      this.itemData.bids.length,
    );
    this.updateMinimumBid();

    BidHistoryRenderer.render(this.itemData.bids);
  }
}
