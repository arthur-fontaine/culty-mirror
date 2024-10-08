package main

import (
	"context"
	"os"
	"path/filepath"

	utils "github.com/arthur-fontaine/culty/libs/go-utils/src"
	"github.com/arthur-fontaine/culty/services/assets-service/types/go/services/assets"

	"github.com/google/uuid"

	"github.com/palantir/witchcraft-go-server/v2/config"
	"github.com/palantir/witchcraft-go-server/v2/witchcraft"
)

type AssetsService struct {
	env utils.Env
}

func (a *AssetsService) Upload(ctx context.Context, requestArg assets.UploadAssetRequest) (assets.UploadAssetResponse, error) {
	cwd, err := os.Getwd()
	if err != nil {
		return assets.UploadAssetResponse{}, err
	}

	id := uuid.New().String()

	fileName := id + filepath.Ext(requestArg.Name)
	completeFileName := filepath.Join(cwd, a.env.ASSETS_PATH, requestArg.Type.String(), fileName)

	err = os.MkdirAll(filepath.Dir(completeFileName), os.ModePerm)
	if err != nil {
		return assets.UploadAssetResponse{}, err
	}

	file, err := os.Create(completeFileName)
	if err != nil {
		return assets.UploadAssetResponse{}, err
	}
	defer file.Close()

	file.Write(requestArg.Data)

	return assets.UploadAssetResponse{
		Id: fileName,
	}, nil
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
