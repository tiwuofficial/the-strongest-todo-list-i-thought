import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Storage} from '@google-cloud/storage';
import * as sharp from 'sharp';
import * as path from 'path';
import * as os from 'os';

const THUMB_MAX_WIDTH = 800;

const THUMB_PREFIX = 'thumb_';

// 初期設定
admin.firestore();

// sharpで最大幅のみを指定してリサイズ
const resizeImage = (tmpFilePath: string, destFilePath: string, width: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        sharp(tmpFilePath)
            .resize(width, null)
            .toFile(destFilePath, (err, _) => {
                if (!err) {
                    resolve();
                } else {
                    reject(err);
                }
            });
    });
};

// 画像のリサイズ処理
export const generateThumbnail = functions.storage.object().onFinalize((object) => {
    // ファイルパスの取得
    const filePath = object.name;
    if (!filePath) {
        return;
    }
    // ContentTypeの取得
    const contentType = object.contentType;
    if (!contentType) {
        return;
    }
    // ディレクトを取得
    const fileDir = path.dirname(filePath);
    // ファイル名を取得する
    const fileName = path.basename(filePath);

    // 画像以外だったらなにもしない
    if (!contentType.startsWith('image/')) {
        console.log("これは画像ではありません");
        return;
    }

    // すでにリサイズ済みだったら何もしない
    if (fileName.startsWith(THUMB_PREFIX)) {
        console.log("すでにリサイズ済みです");
        return;
    }

    const storage = new Storage();
    const bucket = storage.bucket(object.bucket);
    const file = bucket.file(filePath);
    const metadata = { contentType: contentType };

    const filePathPop = filePath.split('/').pop();
    if (!filePathPop) {
        return;
    }
    // 一時ディレクトリ
    const tempLocalFile = path.join(os.tmpdir(), filePathPop);
    // リサイズ後の一時ファイル場所
    const thumbFilePath = path.normalize(path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
    const thumbFilePathPop = thumbFilePath.split('/').pop();
    if (!thumbFilePathPop) {
        return;
    }
    const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePathPop);

    (async () => {
        console.log("一時ローカルファイルは：" + tempLocalFile);
        console.log("ディレクトリは" + fileDir);
        // // 一時ディレクトに保存する
        await file.download({destination: tempLocalFile});
        console.log("一時リサイズファイルは：" + tempLocalThumbFile);
        // 画像をリサイズする
        await resizeImage(tempLocalFile, tempLocalThumbFile, THUMB_MAX_WIDTH);
        console.log("保存先のバケットは" + path.join(fileDir, `${THUMB_PREFIX}${fileName}`));
        // リサイズされたサムネイルをバケットにアップロード
        await bucket.upload(tempLocalThumbFile, { destination: path.join(fileDir, `${THUMB_PREFIX}${fileName}`), metadata: metadata });
        await bucket.file(filePath).delete()
    })()
        .then(() => console.log("リサイズに成功しました"))
        .catch(err => console.log("エラーが発生しました" + err));

});