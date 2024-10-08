import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagesService } from '../../../services/images.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateAnonymousPostService } from './create-anonymous-post.service';
import { ClipboardModule } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-create-anonymous-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ClipboardModule],
  templateUrl: './create-anonymous-post.component.html',
  styleUrl: './create-anonymous-post.component.css',
})
export class CreateAnonymousPostComponent implements OnInit {
  file: File | null = null;
  title: string = '';
  imageUrl: string | undefined = undefined;
  urlObject = new URL(window.location.href);
  imageToShareUrl: string =
    this.urlObject.origin.replace(/^https?:\/\//, '') + '/a/'; // URL to display the image

  constructor(
    private router: Router,
    private imagesService: ImagesService,
    private createAnonymousPostService: CreateAnonymousPostService
  ) {}

  ngOnInit() {
    // Retrieve the file from the service
    this.file = this.imagesService.getFile();

    if (this.file) {
      // Generate a URL for the image file to display it in the template
      this.imageUrl = URL.createObjectURL(this.file);
    } else {
      this.router.navigate(['/new-post']);
    }

    // Optionally clear the file from the service after usage
    //this.fileTransferService.clearFile();
  }
  onPublish() {
    if (this.file) {
      this.createAnonymousPostService
        .createAnonymousPost(this.file, this.title)
        .subscribe({
          next: (res: any) => {
            this.imageToShareUrl += res.linkId;
            console.log(this.imageToShareUrl);
          },
        });
    }
  }

  // Cleanup the URL object when component is destroyed to prevent memory leaks
  ngOnDestroy() {
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
}
