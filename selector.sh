#!/bin/bash

DIRNAME=$(dirname $0)

if [ ! -z $BASH_SOURCE ]; then
	DIRNAME=$(dirname $BASH_SOURCE)
fi

node $DIRNAME/index.js

proyectDirectory=$(cat $DIRNAME/.selected-project 2>/dev/null)

if [ ! -z $proyectDirectory ] && [ -d /var/www/$proyectDirectory ]; then
	cd /var/www/$proyectDirectory
fi
