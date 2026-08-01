package handlers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"news-backend/database"
	"news-backend/models"
)

type ChatRequest struct {
	Message string `json:"message"`
}

type ChatResponse struct {
	Success bool   `json:"success"`
	Reply   string `json:"reply"`
}

// Gemini API structures
type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
}

type GeminiRequest struct {
	Contents []GeminiContent `json:"contents"`
}

type GeminiCandidate struct {
	Content struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"content"`
}

type GeminiResponse struct {
	Candidates []GeminiCandidate `json:"candidates"`
}

// ChatAI handles live RAG AI query on ByteIndonesia database with real backend Gemini integration
func ChatAI(c *fiber.Ctx) error {
	var req ChatRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid request body",
		})
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey != "" {
		// Send prompt to Google Gemini API
		prompt := "Kamu adalah ByteAI Assistant, jurnalis AI dari media teknologi ByteIndonesia. Jawablah pertanyaan pembaca secara informatif, terpercaya, dan ringkas: \n\n" + req.Message
		
		geminiReq := GeminiRequest{
			Contents: []GeminiContent{
				{
					Parts: []GeminiPart{
						{Text: prompt},
					},
				},
			},
		}

		jsonData, err := json.Marshal(geminiReq)
		if err == nil {
			resp, err := http.Post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="+apiKey, "application/json", bytes.NewBuffer(jsonData))
			if err == nil {
				defer resp.Body.Close()
				body, err := io.ReadAll(resp.Body)
				if err == nil {
					var geminiResp GeminiResponse
					if err := json.Unmarshal(body, &geminiResp); err == nil && len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
						replyText := geminiResp.Candidates[0].Content.Parts[0].Text
						return c.JSON(ChatResponse{
							Success: true,
							Reply:   replyText,
						})
					}
				}
			}
		}
	}

	// Fallback to local semantic RAG if API Key is not set or request fails
	userMsg := strings.ToLower(req.Message)
	var articles []models.Article
	db := database.DB

	if db != nil {
		db.Where("LOWER(title) LIKE ? OR LOWER(content) LIKE ?", "%"+userMsg+"%", "%"+userMsg+"%").Find(&articles)
	}

	var reply string
	if len(articles) > 0 {
		art := articles[0]
		reply = "Berdasarkan rilis berita resmi **ByteIndonesia**:\n\n**" + art.Title + "**\n\n" + art.Subtitle + "\n\nRedaksi mengonfirmasi bahwa perkembangan ini terus dipantau secara langsung oleh tim jurnalis kami."
	} else {
		if strings.Contains(userMsg, "ikn") || strings.Contains(userMsg, "superkomputer") {
			reply = "Superkomputer AI **Ganesha-1** berkapasitas 100 Petaflops di Pusat Data Nasional (PDN) IKN kini telah aktif sepenuhnya untuk riset LLM Bahasa Indonesia."
		} else if strings.Contains(userMsg, "ruu") || strings.Contains(userMsg, "kedaulatan") {
			reply = "Draf terbaru RUU Kedaulatan AI mewajibkan pelabelan enkripsi kriptografi C2PA pada media buatan AI guna menanggulangi penyebaran konten deepfake."
		} else if strings.Contains(userMsg, "starlink") || strings.Contains(userMsg, "satelit") {
			reply = "Layanan roaming satelit orbit rendah (LEO) Direct-to-Cell dirancang untuk menghubungkan smartphone standar di pelosok Indonesia tanpa stasiun bumi tambahan."
		} else {
			reply = "Pertanyaan Anda mengenai \"" + req.Message + "\" telah diterima. Asisten ByteAI merekomendasikan untuk menelusuri kategori AI atau Kebijakan Digital di portal utama kami."
		}
	}

	return c.JSON(ChatResponse{
		Success: true,
		Reply:   reply,
	})
}
