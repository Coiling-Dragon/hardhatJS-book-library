# Hardhat Project

- The administrator (owner) of the library should be able to add new books and the number of copies in the library.
- Users should be able to see the available books and borrow them by their id.
- Users should be able to return books.
- A user should not borrow more than one copy of a book at a time. The users should not be able to borrow a book more times than the copies in the libraries unless copy is returned.
- Everyone should be able to see the addresses of all people that have ever borrowed a given book.


Вместо в remix, контрактите си ги напиши, ползвайки hardhat като напишеш и тестове и си пуснеш test coverage, за да стигнеш максимално висок процент на покритие на тестовете;
Функционално да се добави ERC20 токен, с който да се плаща за книга. Когато една книга се създаде, да и бъде определена цена, и при наемане да се плати тази цена (за целите на задачата няма нужда да се влиза в детайли за какъв срок се наема и тн.). Плащането да става с transferFrom във функцията за наемане. И токените да се изпращат директно на owner-a на контракта.




```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
