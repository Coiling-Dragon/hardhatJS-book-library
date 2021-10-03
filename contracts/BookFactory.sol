//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BookFactory is Ownable{
    event NewBook(uint _bookId, uint _price , uint _copies, string _title);

    struct Book {
        uint price;
        uint copies;
        string title;
    }

    Book[] internal books;

    ///@dev mapping (address => mapping(uint => bool)) may be better solution for userBooks
    mapping (address => uint[]) internal userBooks;
    mapping (uint => address[]) internal bookHolderHistory;

    function addBook(uint _price , uint _copies, string memory _title) public onlyOwner {
        //The administrator (owner) of the library should be able to add new books and the number of copies in the library.
        books.push(Book(_price , _copies, _title));
        uint _bookId = books.length-1;
        emit NewBook(_bookId, _price , _copies, _title);
    }
}