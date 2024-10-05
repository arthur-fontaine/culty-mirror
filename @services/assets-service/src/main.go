package main

import (
	"context"
	"log"
	"os"
	"path/filepath"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	"github.com/arthur-fontaine/culty/services/assets-service/types/go/services/assets"

	"github.com/palantir/witchcraft-go-server/v2/config"
	"github.com/palantir/witchcraft-go-server/v2/witchcraft"
)

type AssetsService struct {
	env utils.Env
}

func (a *AssetsService) Upload(ctx context.Context, requestArg assets.UploadAssetRequest) error {
	cwd, err := os.Getwd()
	if err != nil {
		return err
	}

	fileName := filepath.Join(cwd, a.env.ASSETS_PATH, requestArg.Type.String(), requestArg.Name)

	err = os.MkdirAll(filepath.Dir(fileName), os.ModePerm)
	if err != nil {
		return err
	}

	file, err := os.Create(fileName)
	if err != nil {
		return err
	}
	defer file.Close()

	// log the data (it is a byte array)
	log.Printf("Received data: %v", requestArg.Data)

	file.Write(requestArg.Data)

	return nil
}

func main() {
	env := utils.GetEnv()

	if err := witchcraft.NewServer().
		WithInitFunc(func(ctx context.Context, info witchcraft.InitInfo) (func(), error) {
			if err := assets.RegisterRoutesAssetsService(info.Router, &AssetsService{env: env}); err != nil {
				return nil, err
			}
			return nil, nil
		}).
		WithSelfSignedCertificate().
		WithECVKeyProvider(witchcraft.ECVKeyNoOp()).
		WithInstallConfig(config.Install{
			ProductName: "media-service",
			Server: config.Server{
				Port: env.ASSETS_UPLOAD_SERVICE_PORT,
			},
			UseConsoleLog: true,
		}).
		WithRuntimeConfig(config.Runtime{}).
		Start(); err != nil {
		panic(err)
	}
}
