const { expect } = require("chai");
const { ethers } = require("hardhat");


let libraryToken;
let bookContract;
let owner;
let addr1;
let addr2;


describe("Book library contract", function () {
  
  beforeEach(async function () {
    LToken = await ethers.getContractFactory("LToken");
    BookLibrary = await ethers.getContractFactory("BookLibrary");
    [owner, addr1, addr2, _] = await ethers.getSigners();

    libraryToken = await LToken.deploy(100000);
    bookContract = await BookLibrary.deploy(libraryToken.address);

    await libraryToken.transfer(addr1.address, 50);
    await libraryToken.connect(addr1).approve(bookContract.address,50)
  });

  describe("Deployment", function () {

    it("Should assign the correct owner", async function () {
      expect(await bookContract.owner()).to.equal(owner.address);
    });
  });

  describe("Book creation", function () {

    it("Should add books", async function () {
      let price = 50;
      let copies = 10;
      let title = "TestBook";
      
      expect(await bookContract.addBook(price,copies,title));
    });

    it("Should emit NewBook", async function () {
      let price = 50;
      let copies = 10;
      let title = "TestBook";
      
      expect(await bookContract.addBook(price,copies,title))
        .to.emit(bookContract, "NewBook")
        .withArgs(0,price,copies,title);
    });

    it("Should fail to add books, if sender is not owner", async function () {
      let price = 50;
      let copies = 10;
      let title = "TestBook";
      
      await expect(bookContract.connect(addr1).addBook(price,copies,title))
      .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Book borrowing", function () {

    it("Should borrow books", async function () {
      //add a book
      await bookContract.addBook(50,1,"Tester");
      
      let bookId = 0;
      expect(await bookContract.connect(addr1).borrowBook(bookId)).to.emit(bookContract, "BookBorrow")
    });

    it("Should reduce copies after borrowing", async function () {
      //add a book
      let copies = 2;
      await bookContract.addBook(50,copies,"Tester");
      
      let bookId = 0;
      expect(await bookContract.connect(addr1).borrowBook(bookId)).to.emit(bookContract, "BookBorrow")

      let book = await bookContract.viewBook(0);
      expect(book.copies).to.equal(copies-1);
    });


    it("Should not borrow if copies equal zero", async function () {
      //add a book
      await bookContract.addBook(10,0,"Tester");

      let bookId = 0;
      await expect(bookContract.connect(addr1).borrowBook(bookId))
        .to.be.revertedWith("Not enough copies");
    });

    it("Should not borrow same book twice", async function () {
      //add a book
      await bookContract.addBook(10,5,"Tester");

      let bookId = 0;
      expect(await bookContract.connect(addr1).borrowBook(bookId));

      await expect(bookContract.connect(addr1).borrowBook(bookId))
        .to.be.revertedWith("This book is already borrowed");
    });

    it("Should not borrow if ERC20 tokens are not enough", async function () {
      //add a book
      await bookContract.addBook(60,1,"Tester");

      await libraryToken.connect(addr1).approve(bookContract.address,100);

      let bookId = 0;
      await expect(bookContract.connect(addr1).borrowBook(bookId))
        .to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

  });

  describe("Book returns", function () {

    beforeEach(async function () {
      await bookContract.addBook(10,1,"Tester");
      expect(await bookContract.connect(addr1).borrowBook(0)).to.emit(bookContract, "BookBorrow")
    })

    it("Should return a book", async function () {
      expect(await bookContract.connect(addr1).returnBook(0)).to.emit(bookContract, "BookRetur")
    });

    it("Should not return a book that is not borrowed beforehand", async function () {
      await bookContract.addBook(10,1,"secondTester");

      await expect(bookContract.connect(addr1).returnBook(1)).to.revertedWith("This book is not borrowed")
    });

    it("Should add a copy after return", async function () {
      
    });

  });


  describe("View functions", function () {

    beforeEach(async function () {
      //adding 4 books, one wiht 0 copies
      await bookContract.addBook(5,10,"Tester");
      await bookContract.addBook(10,12,"Tester2");
      await bookContract.addBook(20,54,"Tester3");
      await bookContract.addBook(20,0,"Tester3");

      expect(await bookContract.connect(addr1).borrowBook(0)).to.emit(bookContract, "BookBorrow")
    })

    it("Should get only available books with copies by id", async function () {
      //4 books, one wiht 0 copies should return 3
      let books = await bookContract.availableBooks();
      expect(books.length).to.equal(3);
    });

    it("Should inspect book by id", async function () {
      let price = 50;
      let copies = 10;
      let title = "inspectTestBook";
      
      await bookContract.addBook(price,copies,title);

      let books = await bookContract.availableBooks();
      let lastBookId = books[books.length-1]

      let book = await bookContract.viewBook(lastBookId);
      expect(book.price).to.equal(price);
      expect(book.copies).to.equal(copies);
      expect(book.title.toString()).to.equal(title);
    });

    it("Should get book history", async function () {
      let bookId = 0

      //transfer and approve second account
      await libraryToken.transfer(addr2.address, 50);
      await libraryToken.connect(addr2).approve(bookContract.address,50)

      //second 
      expect(await bookContract.connect(addr2).borrowBook(bookId)).to.emit(bookContract, "BookBorrow")

      //addr1 return so we can burrow again and confirm that the return history is changed
      expect(await bookContract.connect(addr1).returnBook(bookId)).to.emit(bookContract, "BookRetur")
      //addr1 borrowBook second time
      expect(await bookContract.connect(addr1).borrowBook(bookId)).to.emit(bookContract, "BookBorrow")

      let bookHistory = await bookContract.bookHistory(bookId);
      expect(await bookHistory.length).to.equal(2)
    });

  });

});
