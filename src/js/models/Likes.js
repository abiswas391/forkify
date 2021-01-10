export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, image) {
        const like = { id, title, author, image };
        this.likes.push(like);

        // Persists the data in Local storage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        this.likes.splice(this.likes.findIndex(el => el.id === id), 1);

        // Persists the data in Local storage
        this.persistData();
    }

    isLiked(id) {
        const index = this.likes.findIndex(el => el.id === id);
        return index === -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    }
}