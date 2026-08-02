package main

import (
	"log"
	"os"

	"byteindonesia/backend/database"
	"byteindonesia/backend/handlers"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("ℹ️ Warning: File .env tidak ditemukan, menggunakan nilai default environment.")
	}

	// Initialize Database Connection
	_, _ = database.ConnectDB()

	// Initialize Fiber App
	app := fiber.New(fiber.Config{
		AppName:      "ByteIndonesia News Backend API v1.0",
		ServerHeader: "Fiber/Go-PostgreSQL",
	})

	// Global Middlewares
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Health Check Route
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":    "online",
			"service":   "ByteIndonesia High-Performance Go Service",
			"db_status": database.DB != nil,
			"user_db":   os.Getenv("DB_USER"),
			"database":  os.Getenv("DB_NAME"),
		})
	})

	// API Group v1
	api := app.Group("/api/v1")

	// Authentication Endpoint
	api.Post("/auth/login", handlers.Login)

	// Article Endpoints
	api.Get("/articles", handlers.GetArticles)
	api.Get("/articles/:slug", handlers.GetArticleBySlug)
	api.Post("/articles", handlers.CreateArticle)
	api.Put("/articles/:id", handlers.UpdateArticle)
	api.Delete("/articles/:id", handlers.DeleteArticle)

	// Financial Index Endpoint
	api.Get("/tech-indexes", handlers.GetTechIndexes)

	// AI Assistant Endpoint
	api.Post("/ai/summarize", handlers.AISummarize)
	api.Post("/ai/chat", handlers.ChatAI)

	// Newsletter Subscription Endpoint
	api.Post("/newsletter/subscribe", handlers.SubscribeNewsletter)

	// Syndication & Aggregator RSS/JSON Feeds
	app.Get("/rss.xml", handlers.GetRSSFeed)
	app.Get("/feed.json", handlers.GetJSONFeed)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("⚡ ByteIndonesia Go REST API server aktif pada http://localhost:%s\n", port)
	log.Fatal(app.Listen(":" + port))
}
