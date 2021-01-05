printf "Generating minified HTML sites..."
# html-minifier --collapse-whitespace --minify-css true --minify-js true --minify-urls true --remove-tag-whitespace --input-dir webroot --output-dir webroot-dist

html-minifier --collapse-whitespace --remove-comments --remove-optional-tags \
              --remove-redundant-attributes --remove-script-type-attributes \
              --remove-tag-whitespace --use-short-doctype --minify-css true --minify-js true \
              --file-ext html --input-dir webroot --output-dir webroot-dist

printf "Done\n"