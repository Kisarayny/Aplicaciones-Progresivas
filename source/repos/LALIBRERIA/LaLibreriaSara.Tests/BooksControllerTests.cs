using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.EntityFrameworkCore;
using LaLibreriaSara.Controllers;
using LaLibreriaSara.Models;
using System;

namespace LaLibreriaSara.Tests
{
    [TestClass]
    public class BooksControllerTest : IDisposable
    {
        private AppDbContext _context;
        private DbContextOptions<AppDbContext> _dbContextOptions;
        private BooksController _booksController;

        public BooksControllerTest()
        {
            // Crear un nombre único para la base de datos de cada prueba
            _dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Nombre único por prueba
                .Options;

            _context = new AppDbContext(_dbContextOptions);
            _booksController = new BooksController(_context);
        }

        [TestMethod]
        public void Index_Returns_ViewResult_With_AtLeast_One_Book()
        {
            // Arrange
            _context.Books.Add(new Book { Title = "Test Book", Author = "Test Author", Genre = "Fiction", Description = "Test Description", Price = 9.99M });
            _context.SaveChanges();

            // Act
            var result = _booksController.Index().Result;

            // Assert
            Assert.IsInstanceOfType(result, typeof(ViewResult));
            var viewResult = (ViewResult)result;
            var model = viewResult.Model as List<Book>;
            Assert.IsTrue(model.Count > 0); // Espera al menos un libro
        }

        [TestMethod]
        public void Create_Post_Returns_RedirectToActionResult_When_Valid_Book()
        {
            // Arrange
            var newBook = new Book
            {
                Title = "New Book",
                Author = "New Author",
                Genre = "Non-fiction",
                Description = "New Description",
                Price = 19.99M
            };

            // Act
            var result = _booksController.Create(newBook).Result;

            // Assert
            Assert.IsInstanceOfType(result, typeof(RedirectToActionResult));
            var redirectResult = (RedirectToActionResult)result;
            Assert.AreEqual("Index", redirectResult.ActionName);
        }

        [TestMethod]
        public void Edit_Post_Returns_RedirectToActionResult_When_Valid_Book()
        {
            // Arrange
            var book = new Book
            {
                Title = "Existing Book",
                Author = "Existing Author",
                Genre = "Fantasy",
                Description = "Existing Description",
                Price = 15.99M
            };
            _context.Books.Add(book);
            _context.SaveChanges();

            book.Title = "Updated Book";

            // Act
            var result = _booksController.Edit(book.Id, book).Result;

            // Assert
            Assert.IsInstanceOfType(result, typeof(RedirectToActionResult));
            var redirectResult = (RedirectToActionResult)result;
            Assert.AreEqual("Index", redirectResult.ActionName);
        }

        [TestMethod]
        public void DeleteConfirmed_Post_Deletes_Book()
        {
            // Arrange
            var book = new Book
            {
                Title = "Book to Delete",
                Author = "Author to Delete",
                Genre = "Science",
                Description = "To be deleted",
                Price = 29.99M
            };
            _context.Books.Add(book);
            _context.SaveChanges();

            var bookId = book.Id;

            // Act
            var result = _booksController.DeleteConfirmed(bookId).Result;

            // Assert
            Assert.IsInstanceOfType(result, typeof(RedirectToActionResult));
            var redirectResult = (RedirectToActionResult)result;
            Assert.AreEqual("Index", redirectResult.ActionName);

            // Verificar que el libro fue eliminado
            var deletedBook = _context.Books.Find(bookId);
            Assert.IsNull(deletedBook);
        }

        // Dispose para liberar recursos
        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
