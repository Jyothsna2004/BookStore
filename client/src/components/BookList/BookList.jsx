import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shop/products/get');
        if (response.data && response.data.success && response.data.data) {
          // Filter books that have PDFs
          const booksWithPdfs = response.data.data.filter(book => book.pdfUrl);
          setBooks(booksWithPdfs);
        } else {
          setError('No books found');
        }
      } catch (err) {
        setError('Error fetching books: ' + (err.response?.data?.message || err.message));
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Available Books to Read</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-[300px] object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-blue-500 hover:bg-blue-600">
                PDF Available
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold mb-2">{book.title}</h3>
              <p className="text-muted-foreground mb-2">By {book.author}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
              <div className="flex flex-col gap-2">
                <Button asChild variant="default" className="w-full">
                  <Link to={`/preview/${book._id}`}>
                    Read PDF
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookList; 