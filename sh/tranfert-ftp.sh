#!/bin/sh
HOST='www.polinux.net'
USER='u48477930'
PASSWD='1&1_plnx'
FILE='rtx_pbqd_2014-10-24.sql.gzip'

ftp -n $HOST <<END_SCRIPT
quote USER $USER
quote PASS $PASSWD
lcd ../data
cd backup_pbqd
put $FILE
bye
END_SCRIPT

exit 0
