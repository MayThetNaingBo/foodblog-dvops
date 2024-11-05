class BlogPost {
    constructor(title, content, author, imageUrl) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.imageUrl = imageUrl;

        // Automatically generate a timestamp and unique ID
        this.datePublished = new Date().toISOString(); // ISO format for readability
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = `${timestamp}${random.toString().padStart(3, "0")}`;
    }
}

module.exports = { BlogPost };
