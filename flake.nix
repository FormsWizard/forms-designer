{
  description = "Forms Designer flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in rec {
        packages.test-gh-pages-workflow = pkgs.writeShellScriptBin "test-gh-pages-workflow" ''
          echo "Testing GitHub Pages workflow with act..."
          ${pkgs.act}/bin/act -W .github/workflows/pages.yml --job build -P ubuntu-24.04=catthehacker/ubuntu:act-latest --env GITHUB_TOKEN=fake_token
        '';

        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_latest
            bun
          ];
        };
      }
    );
}
