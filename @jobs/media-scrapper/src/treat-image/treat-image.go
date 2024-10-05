package treatimage

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"io"
	"log"
	"net/http"
	"path/filepath"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"

	mediadb "github.com/arthur-fontaine/culty/services/media-db/prisma/generated/clientgo"
	"github.com/galdor/go-thumbhash"
)

func TreatImage(env utils.Env, mediaImage mediadb.InnerMediaImage) (mediadb.MediaImageModel, error) {
	if mediaImage.URL == "" {
		return mediadb.MediaImageModel{}, nil
	}

	img, imgBytes, err := downloadImage(mediaImage.URL)
	if err != nil {
		log.Println("Failed to download image", err)
		return mediadb.MediaImageModel{}, err
	}

	assetID, err := sendImageToAssetService(env, imgBytes, mediaImage.URL)
	if err != nil {
		log.Println("Failed to send image to asset service", err)
		return mediadb.MediaImageModel{}, err
	}

	mediaImage.Width = img.Bounds().Dx()
	mediaImage.Height = img.Bounds().Dy()
	mediaImage.Thumbhash = base64.StdEncoding.EncodeToString(thumbhash.EncodeImage(img))
	mediaImage.URL = assetID

	return mediadb.MediaImageModel{
		InnerMediaImage: mediaImage,
	}, nil
}

func downloadImage(url string) (image.Image, []byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		log.Println("Failed to get image", url, err)
		return nil, nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Failed to read image body", url, err)
		return nil, nil, err
	}

	img, _, err := image.Decode(bytes.NewReader(body))
	if err != nil {
		log.Println("Failed to decode image", url, err)
		return nil, nil, err
	}

	return img, body, nil
}

func sendImageToAssetService(env utils.Env, imgBytes []byte, imagePath string) (string, error) {
	base64Image := base64.StdEncoding.EncodeToString(imgBytes)
	body := []byte(`{
		"name":"` + filepath.Base(imagePath) + `",
		"type": "MEDIA_IMAGE",
		"data": "` + base64Image + `"
	}`)

	url := "https://localhost:" + fmt.Sprint(env.ASSETS_UPLOAD_SERVICE_PORT) + "/upload"

	httpClient := http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	resp, err := httpClient.Post(url, "application/json", bytes.NewReader(body))
	if err != nil {
		log.Println("Failed to post image to asset service", err)
		return "", err
	}
	defer resp.Body.Close()

	body, err = io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Failed to read asset service response", err)
		return "", err
	}

	respBody := struct {
		ID string `json:"id"`
	}{}
	if err := json.Unmarshal(body, &respBody); err != nil {
		return "", err
	}

	return respBody.ID, nil
}
