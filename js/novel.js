var novelCategory = document.getElementById("novelCategory")
novelCategory.addEventListener("change", (event) => {
    UpdateNovelCategory(event.target.value)
})

const UpdateNovelCategory = (category) => {
    fetch(`${window.location.pathname}/category`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category: category })
    })
}

var starRadios = document.querySelectorAll(".rating input")
starRadios.forEach(radio => {
    radio.addEventListener("click", (event) => {
        UpdateNovelRating(event.target.value)
    })
})

const UpdateNovelRating = (rating) => {
    fetch(`${window.location.pathname}/rating`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: rating })
    })
}

var submitReviewButton = document.getElementById("submitNovelReviewButton")
var novelReview = document.getElementById("novelReviewInput")
submitReviewButton.addEventListener("click", (event) => {
    UpdateNovelReview(novelReview.value)
})

const UpdateNovelReview = (review) => {
    fetch(`${window.location.pathname}/review`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ review: review })
    })
}

tippy('#novelReviewTooltip', {
    content: 'No one can see your review except you. This is for reminding future-you if this novel is worth reading'
})