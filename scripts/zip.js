import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// 从 package.json 读取版本号
const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const version = packageJson.version || '1.0.0';
const distDir = path.join(rootDir, 'dist');
const outputPath = path.join(rootDir, 'dist.zip');
const outerFolderName = `dist-${version}`;

// 使用 PowerShell 压缩，包含外层文件夹（静默模式）
const powershell = spawn('powershell', [
	'-Command',
	`$ErrorActionPreference='SilentlyContinue'; ` +
	`$tempDir = [System.IO.Path]::Combine([System.IO.Path]::GetTempPath(), 'vite-work-time-temp'); ` +
	`$outerPath = [System.IO.Path]::Combine($tempDir, '${outerFolderName}'); ` +
	`New-Item -ItemType Directory -Path $outerPath -Force | Out-Null; ` +
	`Copy-Item -Path '${distDir}\\*' -Destination $outerPath -Recurse -Force | Out-Null; ` +
	`Compress-Archive -Path $outerPath -DestinationPath '${outputPath}' -Force | Out-Null; ` +
	`Remove-Item -Path $tempDir -Recurse -Force | Out-Null`
]);

powershell.stderr.on('data', (data) => {
	console.error(`压缩错误: ${data.toString().trim()}`);
});

powershell.on('close', (code) => {
	if (code === 0) {
		console.log(`\n压缩完成！文件: dist.zip (外层文件夹: ${outerFolderName})`);
	} else {
		console.log(`\n压缩失败，退出码: ${code}`);
		process.exit(code);
	}
});
