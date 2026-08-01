package models

import (
	"time"

	"gorm.io/gorm"
)

// User Model (Jurnalis / Editor Admin)
type User struct {
	ID           uint           `gorm:"primaryKey" json:"id"`
	Username     string         `gorm:"uniqueIndex;not null" json:"username"`
	Email        string         `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string         `json:"-"`
	FullName     string         `json:"full_name"`
	Role         string         `gorm:"default:'editor'" json:"role"` // 'admin', 'editor', 'journalist'
	Avatar       string         `json:"avatar"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

// Category Model
type Category struct {
	ID          string    `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"not null" json:"name"`
	Icon        string    `json:"icon"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Article Model
type Article struct {
	ID              string         `gorm:"primaryKey" json:"id"`
	Title           string         `gorm:"not null;type:text" json:"title"`
	Slug            string         `gorm:"uniqueIndex;not null" json:"slug"`
	Subtitle        string         `gorm:"type:text" json:"subtitle"`
	CategoryID      string         `gorm:"index;not null" json:"category"`
	Category        Category       `gorm:"foreignKey:CategoryID" json:"category_detail,omitempty"`
	AuthorID        uint           `json:"author_id"`
	AuthorName      string         `json:"author_name"`
	AuthorAvatar    string         `json:"author_avatar"`
	PublishedAt     time.Time      `json:"published_at"`
	ReadTimeMinutes int            `gorm:"default:4" json:"read_time_minutes"`
	ImageURL        string         `gorm:"type:text" json:"image_url"`
	ImageCaption    string         `gorm:"type:text" json:"image_caption"`
	IsFeatured      bool           `gorm:"default:false;index" json:"is_featured"`
	IsTrending      bool           `gorm:"default:false;index" json:"is_trending"`
	IsBreaking      bool           `gorm:"default:false;index" json:"is_breaking"`
	ViewsCount      int64          `gorm:"default:0" json:"views_count"`
	LikesCount      int64          `gorm:"default:0" json:"likes_count"`
	AISummary       string         `gorm:"type:text" json:"ai_summary"` // JSON Array string
	Content         string         `gorm:"type:text" json:"content"`
	Status          string         `gorm:"default:'published';index" json:"status"` // 'draft', 'published'
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

// TechIndex Model
type TechIndex struct {
	Symbol     string    `gorm:"primaryKey" json:"symbol"`
	Name       string    `json:"name"`
	Value      string    `json:"value"`
	Change     string    `json:"change"`
	IsPositive bool      `json:"is_positive"`
	UpdatedAt  time.Time `json:"updated_at"`
}
