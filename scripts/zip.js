import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// 读取 public/version.json 获取版本号
const versionJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'version.json'), 'utf-8'));
const version = versionJson.version || '1.0.0';
const distDir = path.join(process.cwd(), 'dist');
const outputPath = path.join(process.cwd(), 'dist.zip');
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