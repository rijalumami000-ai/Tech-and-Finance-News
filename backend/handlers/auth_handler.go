package handlers

import (
	"os"
	"time"

	"byteindonesia/backend/database"
	"byteindonesia/backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Token   string `json:"token,omitempty"`
	User    struct {
		Username string `json:"username"`
		FullName string `json:"full_name"`
		Role     string `json:"role"`
	} `json:"user,omitempty"`
}

// POST /api/v1/auth/login
func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(LoginResponse{
			Success: false,
			Message: "Format payload login tidak valid",
		})
	}

	// Verify Admin Credentials (Username: Rijalumami, Password: Rijalumami1002)
	if req.Username == "Rijalumami" && req.Password == "Rijalumami1002" {
		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			jwtSecret = "byteindonesia_secret_key_2026_production"
		}

		// Create JWT Claims
		claims := jwt.MapClaims{
			"username":  "Rijalumami",
			"full_name": "Rijal Umami",
			"role":      "Editor in Chief (Pemred)",
			"exp":       time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days expiration
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		signedToken, err := token.SignedString([]byte(jwtSecret))
		if err != nil {
			return c.Status(500).JSON(LoginResponse{
				Success: false,
				Message: "Gagal memproses penandatanganan JWT Token",
			})
		}

		resp := LoginResponse{
			Success: true,
			Message: "Otentikasi Redaksi Berhasil!",
			Token:   signedToken,
		}
		resp.User.Username = "Rijalumami"
		resp.User.FullName = "Rijal Umami"
		resp.User.Role = "Editor in Chief (Pemred)"

		return c.JSON(resp)
	}

	// Also check PostgreSQL database if DB is online
	if database.DB != nil {
		var user models.User
		if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err == nil {
			// Password validation logic...
		}
	}

	return c.Status(401).JSON(LoginResponse{
		Success: false,
		Message: "Kredensial Username atau Password Redaksi Salah",
	})
}
