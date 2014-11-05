#!/bin/bash
FILE="rtx_pbqd_"`date '+%Y-%m-%d'`".sql.gzip"
HOST='www.polinux.net'
USER='u48477930'
PASSWD='1&1_plnx'
# backup date de la base rtx_pbqd
cd ../data
mysqldump -u pbqd -ppbqd_plnx rtx_pbqd | gzip > $FILE
# Transfert ftp
ftp -n $HOST <<END_SCRIPT
quote USER $USER
quote PASS $PASSWD
lcd ../data
cd backup_pbqd
put $FILE
bye
END_SCRIPT
echo 'Termine'
