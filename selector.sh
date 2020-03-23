#!/bin/bash

DIRNAME=$(dirname $BASH_SOURCE)

node $DIRNAME/index.js

proyectDirectory=$(cat $DIRNAME/.selected-proyect 2>/dev/null)

if [ ! -z $proyectDirectory ] && [ -d /var/www/$proyectDirectory ]; then
	cd /var/www/$proyectDirectory
fi
