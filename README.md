# REST API

統一インターフェース
- HTTPのメソッド（サイトパスではなく、これで操作を判定）は`GET`,`POST`,`PUT`,`DELETE`のみとする
- データは`JSON`形式とする（軽量なため）

アドレス可能性
- データはそれぞれ一意なURIを持たせる

接続性
- データにハイパーリンクを含めることで別のデータにアクセスできるようにする

ステートレス性
- 操作は常に1回で完結する（以前の操作と関連づけない）

# REST API の利点
DBへのアクセスで発生しうる

# dbClient

## CREATE
register
- user_name
- email
- passhash

## READ
find
- userid
- postid

## UPDATE
update
- username
- email
- password

## DELETE
delete
- userid
- postid