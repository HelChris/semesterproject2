export class ItemInfoRenderer {
  static render(itemData) {
    const itemContainer = document.getElementById("item-container");
    if (itemContainer) {
      itemContainer.dataset.createdDate = itemData.created;
    }

    this.renderTitle(itemData.title);
    this.renderTimeLeft(itemData.endsAt);
    this.renderViewCount();
    this.renderTags(itemData.tags);
    this.renderDescription(itemData.description);
    this.renderSellerInfo(itemData.seller);
    this.renderBidInfo(itemData.bids, itemData._count?.bids);
  }

  static renderTitle(title) {
    const titleElement = document.getElementById("item-title");
    if (titleElement) {
      titleElement.textContent = title || "Untitled Item";
    }
  }

  static renderTimeLeft(endsAt) {
    const timeLeftElement = document.getElementById("time-left");
    if (!timeLeftElement) return;

    if (!endsAt) {
      timeLeftElement.textContent = "No end date";
      timeLeftElement.className = "text-gray-500";
      return;
    }

    const updateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(endsAt);
      const timeDiff = endDate - now;

      if (timeDiff <= 0) {
        timeLeftElement.textContent = "Auction ended";
        timeLeftElement.className = "text-red-600 font-bold";
        return;
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      let timeString = "";
      if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m `;
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m`;
      } else {
        timeString = `${minutes}m`;
      }

      timeLeftElement.textContent = timeString;
      timeLeftElement.className =
        timeDiff < 3600000
          ? "text-red-600 font-bold"
          : "text-orange-600 font-bold";
    };

    updateTimeLeft();
    setInterval(updateTimeLeft, 60000);
  }

  static renderViewCount() {
    const viewCountElement = document.getElementById("view-count");
    if (viewCountElement) {
      viewCountElement.textContent = Math.floor(Math.random() * 500) + 50;
    }
  }

  static renderTags(tags = []) {
    const tagsContainer = document.getElementById("tags-container");
    if (!tagsContainer) return;

    if (tags.length === 0) {
      tagsContainer.innerHTML = "";
      return;
    }

    const tagsHTML = tags
      .map(
        (tag) =>
          `<span class="inline-block bg-super-soft-yellow text-black px-3 py1 rounded-full text-md font-medium mr-2 mb-2">
      ${tag}
      </span>`,
      )
      .join("");

    tagsContainer.innerHTML = `
    <div class="flex flex-wrap gap-1">
    ${tagsHTML}
    </div>`;
  }

  static renderDescription(description) {
    const descriptionElement = document.getElementById("item-description");
    if (descriptionElement) {
      descriptionElement.innerHTML = description
        ? `<p>${description.replace(/\n/g, "</p><p>")}</p>`
        : '<p class="text-gray-500 italic">No description available.</p>';
    }
  }

  static renderSellerInfo(seller) {
    const sellerAvatar = document.getElementById("seller-avatar");
    const sellerName = document.getElementById("seller-name");
    const listedDate = document.getElementById("listed-date");

    if (sellerAvatar) {
      sellerAvatar.src =
        seller?.avatar?.url || "/img/avatar1-placeholder.jpg";
      sellerAvatar.alt = `${seller?.name || "Unknown seller"}'s avatar`;
    }

    if (sellerName) {
      sellerName.textContent = seller?.name || "Unknown Seller";
    }

    if (listedDate) {
      const itemContainer = document.getElementById("item-container");
      const createdDate = itemContainer?.dataset.createdDate;

      const formattedDate = this.formatListingDate(createdDate);
      listedDate.textContent = `Listed: ${formattedDate}`;
    }
  }

  static formatListingDate(dateString) {
    if (!dateString) return "Unknown date";

    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "Invalid date";
    }
  }

  static renderBidInfo(bids = [], bidCount = 0) {
    const currentBidElement = document.getElementById("current-bid");
    const bidCountElement = document.getElementById("bid-count");

    if (currentBidElement) {
      const highestBid =
        bids.length > 0 ? Math.max(...bids.map((bid) => bid.amount)) : 0;
      currentBidElement.textContent = `${highestBid} credits`;
    }

    if (bidCountElement) {
      bidCountElement.textContent = `${bidCount} bid${bidCount !== 1 ? "s" : ""}`;
    }
  }
}
