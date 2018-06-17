#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/node_modules/vue-cli/bin/vue" "$@"
  ret=$?
else 
  node  "$basedir/node_modules/vue-cli/bin/vue" "$@"
  ret=$?
fi
exit $ret
