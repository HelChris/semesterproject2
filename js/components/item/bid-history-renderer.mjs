export class BidHistoryRenderer {
  static render(bids = []) {
    const container = document.getElementById('bid-history-container');
    if (!container) return;

    if (bids.length === 0) {
      container.innerHTML= `
        <div class="text-center py-8">
          <p class="text-gray-500">No bids yet. Be the first to bid!</p>
        </div>
      `;
      return;
    }

    const sortedBids = [...bids].sort((a, b) => {
      if (b.amount !== a.amount) {
        return b.amount - a.amount;
      }
      return new Date(b.created) - new Date(a.created);
    });

    const bidsHTML = sortedBids.map((bid, index) => this.createBidCard(bid, index === 0)).join('');

    container.innerHTML = `
      <div class="space-y-4">
        ${bidsHTML}
      </div>
    `;
  }

  static createBidCard(bid, isHighest = false) {
    const timeAgo = this.getTimeAgo(bid.created);
    const avatarUrl = bid.bidder?.avatar?.url || '/img/avatar1-placeholder.jpg';
    const bidderName = bid.bidder?.name || 'Unknown Bidder';

    return `
      <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg ${isHighest ? 'ring-2 ring-forest-green bg-green-50' : ''}">
        <img src="${avatarUrl}"
             alt="${bidderName}'s avatar"
             class="w-12 h-12 rounded-full border-2 border-gray-200">

        <div class="flex-1">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-gray-900">${bidderName}</h3>
            ${isHighest ? '<span class="bg-forest-green text-white text-xs px-2 py-1 rounded-full">Highest Bid</span>' : ''}
          </div>
          <p class="text-sm text-gray-600">${timeAgo}</p>
        </div>

        <div class="text-right">
          <p class="text-lg font-bold text-forest-green">${bid.amount} credits</p>
        </div>
      </div>
    `;
  }

  static getTimeAgo(dateString) {
    const now = new Date();
    const bidDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - bidDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  }
}