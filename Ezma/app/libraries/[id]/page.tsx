import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Phone, Globe, MapPin, Clock, Mail } from "lucide-react"
import Image from "next/image"
import LibraryMap from "@/components/library-map"
import { getLibraryById, getBooksByLibrary } from "@/lib/api"

export default async function LibraryDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { q?: string }
}) {
  // Get search query from URL params
  const searchQuery = searchParams.q || ""

  // Define fallback library data
  const fallbackLibrary = {
    id: Number(params.id),
    name: "Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi",
    address: "Toshkent sh., Navoiy ko'chasi, 1-uy",
    description:
      "O'zbekiston Milliy kutubxonasi — O'zbekistondagi eng yirik kutubxona. 1870-yilda Toshkent jamoat kutubxonasi sifatida tashkil etilgan. 2002-yildan beri Alisher Navoiy nomidagi O'zbekiston Milliy kutubxonasi deb ataladi.",
    phone: "+998 71 232 83 94",
    email: "info@natlib.uz",
    website: "https://natlib.uz",
    working_hours: "Dushanba-Shanba: 9:00 - 20:00, Yakshanba: Dam olish kuni",
    image: "/images/library-shelves.png",
    books_count: 7000000,
    latitude: 41.311081,
    longitude: 69.280624,
  }

  // Define fallback books data
  const fallbackBooks = [
    { id: 1, title: "O'tkan kunlar", author: "Abdulla Qodiriy", year: 1925, available: true },
    { id: 2, title: "Kecha va kunduz", author: "Cho'lpon", year: 1936, available: true },
    { id: 3, title: "Sarob", author: "Abdulla Qahhor", year: 1943, available: false },
    { id: 4, title: "Shum bola", author: "G'afur G'ulom", year: 1936, available: true },
  ]

  // Fetch library details and books
  let library = fallbackLibrary
  let books = []

  try {
    // Try to fetch library details
    try {
      const libraryData = await getLibraryById(params.id)
      if (libraryData) {
        library = libraryData
      }
    } catch (error) {
      console.error("Failed to fetch library details:", error)
      // Use fallback library data defined above
    }

    // Try to fetch books for this library
    try {
      const booksResponse = await getBooksByLibrary(params.id)
      books = booksResponse.results || []

      // If search query is provided, filter books client-side
      if (searchQuery && books.length > 0) {
        const query = searchQuery.toLowerCase()
        books = books.filter(
          (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query),
        )
      }
    } catch (error) {
      console.error("Failed to fetch library books:", error)
      // Use fallback books data defined above
    }
  } catch (error) {
    console.error("Error in library detail page:", error)
    // Use fallback data defined above
  }

  // If no books are returned, use fallback data
  if (!books.length) {
    books = fallbackBooks
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <Link href="/libraries" className="text-sm text-primary hover:underline">
            ← Kutubxonalar ro'yxatiga qaytish
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{library.name}</h1>
          <p className="text-muted-foreground flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            {library.address}
          </p>
        </div>

        <div className="aspect-video relative rounded-lg overflow-hidden">
          <Image
            src={library.image || "/images/library-shelves.png"}
            alt={library.name || "Kutubxona"}
            fill
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about">Ma'lumot</TabsTrigger>
                <TabsTrigger value="books">Kitoblar</TabsTrigger>
                <TabsTrigger value="location">Joylashuv</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Kutubxona haqida</h2>
                  <p>{library.description || "Ma'lumot mavjud emas."}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Ish vaqti</h3>
                        <p className="text-sm text-muted-foreground">
                          {library.working_hours || "Ma'lumot mavjud emas"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-2">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Telefon</h3>
                        <p className="text-sm text-muted-foreground">{library.phone || "Ma'lumot mavjud emas"}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-2">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Veb-sayt</h3>
                        {library.website ? (
                          <a
                            href={library.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            {library.website}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Ma'lumot mavjud emas</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-start space-x-2">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        {library.email ? (
                          <a href={`mailto:${library.email}`} className="text-sm text-primary hover:underline">
                            {library.email}
                          </a>
                        ) : (
                          <p className="text-sm text-muted-foreground">Ma'lumot mavjud emas</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="books">
                <div className="space-y-4">
                  <form className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        name="q"
                        placeholder="Kitob nomini qidirish..."
                        className="w-full pl-10"
                        defaultValue={searchQuery}
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Qidirish
                    </Button>
                  </form>

                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-12 px-4 text-left font-medium">Kitob nomi</th>
                            <th className="h-12 px-4 text-left font-medium">Muallif</th>
                            <th className="h-12 px-4 text-left font-medium">Yil</th>
                            <th className="h-12 px-4 text-left font-medium">Holati</th>
                          </tr>
                        </thead>
                        <tbody>
                          {books.map((book) => (
                            <tr key={book.id} className="border-b">
                              <td className="p-4 align-middle">{book.title}</td>
                              <td className="p-4 align-middle">{book.author}</td>
                              <td className="p-4 align-middle">{book.year || "N/A"}</td>
                              <td className="p-4 align-middle">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    book.available
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  }`}
                                >
                                  {book.available ? "Mavjud" : "Mavjud emas"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="location" className="space-y-6">
                {library.latitude && library.longitude ? (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold">Kutubxona joylashuvi</h2>
                    <LibraryMap libraries={[library]} />
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild className="flex-1">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${library.latitude},${library.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Yo'l ko'rsatmalarini olish
                        </a>
                      </Button>
                      <Button variant="outline" className="flex-1" asChild>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${library.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Google Maps'da ko'rish
                        </a>
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        Koordinatalar: {library.latitude.toFixed(6)}, {library.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <MapPin className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-bold">Joylashuv ma'lumotlari mavjud emas</h2>
                    <p className="text-muted-foreground max-w-md">
                      Bu kutubxona uchun aniq joylashuv ma'lumotlari kiritilmagan.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Kutubxona ma'lumotlari</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kitoblar soni:</span>
                    <span className="font-medium">{(library.books_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mavjud kitoblar:</span>
                    <span className="font-medium">{books.filter((b) => b.available).length}</span>
                  </div>
                </div>
                {library.latitude && library.longitude && (
                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Joylashuv</h3>
                    <div className="aspect-square relative rounded-lg overflow-hidden mb-2">
                      <LibraryMap libraries={[library]} height="aspect-square" zoom={15} />
                    </div>
                    <Button className="w-full" asChild>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${library.latitude},${library.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Yo'l ko'rsatmalarini olish
                      </a>
                    </Button>
                  </div>
                )}
                <Button variant="outline" className="w-full">
                  Bog'lanish
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
