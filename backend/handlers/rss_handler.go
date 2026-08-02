package handlers

import (
	"encoding/xml"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"byteindonesia/backend/database"
	"byteindonesia/backend/models"
)

// RSS 2.0 Structs
type RSSItem struct {
	Title       string `xml:"title"`
	Link        string `xml:"link"`
	Description string `xml:"description"`
	PubDate     string `xml:"pubDate"`
	GUID        string `xml:"guid"`
	Category    string `xml:"category"`
	Author      string `xml:"author"`
}

type RSSChannel struct {
	Title         string    `xml:"title"`
	Link          string    `xml:"link"`
	Description   string    `xml:"description"`
	Language      string    `xml:"language"`
	LastBuildDate string    `xml:"lastBuildDate"`
	Items         []RSSItem `xml:"item"`
}

type RSS struct {
	XMLName string     `xml:"rss"`
	Version string     `xml:"version,attr"`
	Channel RSSChannel `xml:"channel"`
}

// JSON Feed 1.1 Structs
type JSONFeedItem struct {
	ID            string   `json:"id"`
	URL           string   `json:"url"`
	Title         string   `json:"title"`
	Summary       string   `json:"summary_text"`
	ContentHTML   string   `json:"content_html"`
	DatePublished string   `json:"date_published"`
	Image         string   `json:"image"`
	Tags          []string `json:"tags"`
}

type JSONFeed struct {
	Version     string         `json:"version"`
	Title       string         `json:"title"`
	HomeStyle   string         `json:"home_page_url"`
	FeedURL     string         `json:"feed_url"`
	Description string         `json:"description"`
	Icon        string         `json:"icon"`
	Favicon     string         `json:"favicon"`
	Items       []JSONFeedItem `json:"items"`
}

// GetRSSFeed renders valid XML RSS 2.0 feed
func GetRSSFeed(c *fiber.Ctx) error {
	var articles []models.Article
	db := database.DB

	if db != nil {
		db.Order("published_at desc").Limit(20).Find(&articles)
	}

	baseUrl := "https://byteindonesia.id"
	nowStr := time.Now().Format(time.RFC1123Z)

	var items []RSSItem
	for _, art := range articles {
		artUrl := fmt.Sprintf("%s/#article/%s", baseUrl, art.Slug)
		pubTime, err := time.Parse(time.RFC3339, art.PublishedAt)
		pubTimeStr := nowStr
		if err == nil {
			pubTimeStr = pubTime.Format(time.RFC1123Z)
		}

		items = append(items, RSSItem{
			Title:       art.Title,
			Link:        artUrl,
			Description: art.Subtitle,
			PubDate:     pubTimeStr,
			GUID:        artUrl,
			Category:    art.Category,
			Author:      art.AuthorName,
		})
	}

	rssData := RSS{
		Version: "2.0",
		Channel: RSSChannel{
			Title:         "ByteIndonesia — News Tech Feed",
			Link:          baseUrl,
			Description:   "Portal Berita Teknologi Terdepan & Terupdate khusus AI, Gadget, & Kedaulatan Digital RI",
			Language:      "id-ID",
			LastBuildDate: nowStr,
			Items:         items,
		},
	}

	c.Set("Content-Type", "application/xml; charset=utf-8")
	xmlBytes, err := xml.MarshalIndent(rssData, "", "  ")
	if err != nil {
		return c.Status(500).SendString("Error generating RSS feed")
	}

	return c.SendString(xml.Header + string(xmlBytes))
}

// GetJSONFeed renders valid JSON Feed 1.1
func GetJSONFeed(c *fiber.Ctx) error {
	var articles []models.Article
	db := database.DB

	if db != nil {
		db.Order("published_at desc").Limit(20).Find(&articles)
	}

	baseUrl := "https://byteindonesia.id"

	var items []JSONFeedItem
	for _, art := range articles {
		artUrl := fmt.Sprintf("%s/#article/%s", baseUrl, art.Slug)
		var tags []string
		if art.Tags != "" {
			tags = strings.Split(art.Tags, ",")
		}

		items = append(items, JSONFeedItem{
			ID:            art.ID,
			URL:           artUrl,
			Title:         art.Title,
			Summary:       art.Subtitle,
			ContentHTML:   art.Content,
			DatePublished: art.PublishedAt,
			Image:         art.ImageURL,
			Tags:          tags,
		})
	}

	jsonFeed := JSONFeed{
		Version:     "https://jsonfeed.org/version/1.1",
		Title:       "ByteIndonesia News Feed",
		HomeStyle:   baseUrl,
		FeedURL:     baseUrl + "/feed.json",
		Description: "Portal Berita Teknologi Terdepan & Terupdate",
		Icon:        baseUrl + "/logo.png",
		Favicon:     baseUrl + "/favicon.svg",
		Items:       items,
	}

	return c.JSON(jsonFeed)
}
